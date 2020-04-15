import * as ts from 'typescript';
import * as path from 'path';

const options: ts.CreateProgramOptions = {
  options: {
    allowJs: false,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    noEmit: true,
    lib: [
      path.resolve(
        __dirname,
        '../../../node_modules/typescript/lib/lib.dom.d.ts',
      ),
      path.resolve(
        __dirname,
        '../../../node_modules/typescript/lib/lib.esnext.d.ts',
      ),
    ],
    jsx: ts.JsxEmit.React,
    strict: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
  },
  rootNames: [path.resolve(__dirname, '../../visage/src/index.ts')],
  projectReferences: [
    { path: path.resolve(__dirname, '../../visage-core/tsconfig.json') },
    { path: path.resolve(__dirname, '../../visage-utils/tsconfig.json') },
  ],
};

interface VisitedProperty {
  parent: string | undefined;
  name: string;
  isOptional: boolean;
  documentation: string;
  type: string;
}

export interface VisitorContext {
  [key: string]: {
    properties: VisitedProperty[];
  };
}

interface ObjectTypeVisitorContext {
  properties: VisitedProperty[];
}

function isNodeExported(node: ts.Node): boolean {
  return (
    // eslint-disable-next-line no-bitwise
    (ts.getCombinedModifierFlags(node as ts.Declaration) &
      ts.ModifierFlags.Export) !==
      0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}

function isObjectType(type: ts.Type): type is ts.ObjectType {
  return type.getFlags() === ts.TypeFlags.Object;
}

function isIntersectionType(type: ts.Type): type is ts.IntersectionType {
  return type.getFlags() === ts.TypeFlags.Intersection;
}

function isGenericObjectType(type: ts.ObjectType): type is ts.TypeReference {
  return type.objectFlags === ts.ObjectFlags.Reference;
}

function getPropertyName(property: ts.Symbol): string | undefined {
  const declarations = property.getDeclarations();

  if (!declarations || declarations.length === 0) {
    return undefined;
  }

  const { parent } = declarations[0];

  if (parent.kind === ts.SyntaxKind.InterfaceDeclaration) {
    return (parent as ts.InterfaceDeclaration).name.getText();
  }

  return undefined;
}

function visitObjectProperty(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  ctx: ObjectTypeVisitorContext,
  valueDeclaration: ts.Node,
) {
  const declarations = symbol.getDeclarations() || [
    symbol.valueDeclaration || valueDeclaration,
  ];
  const parentName = getPropertyName(symbol);

  ctx.properties.push({
    parent: parentName,
    name: symbol.getName(),
    // eslint-disable-next-line no-bitwise
    isOptional: (symbol.flags & ts.SymbolFlags.Optional) !== 0,
    documentation: ts.displayPartsToString(
      symbol.getDocumentationComment(checker),
    ),
    type: checker.typeToString(
      checker.getTypeOfSymbolAtLocation(symbol, declarations[0]),
    ),
  });
}

function visitIntersectionType(
  type: ts.IntersectionType,
  checker: ts.TypeChecker,
  ctx: ObjectTypeVisitorContext,
  valueDeclaration: ts.Node,
) {
  checker.getPropertiesOfType(type).forEach(property => {
    visitObjectProperty(property, checker, ctx, valueDeclaration);
  });
}

function visitObjectType(
  type: ts.ObjectType,
  checker: ts.TypeChecker,
  ctx: ObjectTypeVisitorContext,
  valueDeclaration: ts.Node,
) {
  checker.getPropertiesOfType(type).forEach(property => {
    visitObjectProperty(property, checker, ctx, valueDeclaration);
  });
}

function visitTypeReference(
  type: ts.TypeReference,
  checker: ts.TypeChecker,
  ctx: ObjectTypeVisitorContext,
  valueDeclaration: ts.Node,
) {
  const args = checker.getTypeArguments(type);

  args.forEach(arg => {
    // add detection if is really ts.ObjectType?
    visitObjectType(arg as ts.ObjectType, checker, ctx, valueDeclaration);
  });
}

function visitFunctionParameters(
  node: ts.FunctionDeclaration,
  checker: ts.TypeChecker,
  ctx: ObjectTypeVisitorContext,
) {
  node.parameters.forEach(parameter => {
    if (!parameter.type) {
      return;
    }

    const type = checker.getTypeFromTypeNode(parameter.type);

    if (!isObjectType(type)) {
      return;
    }

    visitObjectType(type, checker, ctx, parameter);
  });
}

function visit(node: ts.Node, checker: ts.TypeChecker, ctx: VisitorContext) {
  if (!isNodeExported(node)) {
    return;
  }

  if (ts.isVariableStatement(node) || ts.isVariableDeclarationList(node)) {
    ts.forEachChild(node, child => visit(child, checker, ctx));
  } else if (ts.isVariableDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name);

    if (symbol) {
      const type = checker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration,
      );

      if (!isObjectType(type)) {
        // skip non object/non generic types
        return;
      }

      const variableName = node.name.getText();

      ctx[variableName] = {
        properties: [],
      };

      if (isGenericObjectType(type)) {
        visitTypeReference(type, checker, ctx[variableName], node);
      } else if (type.objectFlags === ts.ObjectFlags.Anonymous) {
        const [signature] = type.getCallSignatures();

        if (!signature) {
          return;
        }

        const parameters = signature.getParameters();

        for (const parameter of parameters) {
          const parameterType = checker.getTypeOfSymbolAtLocation(
            parameter,
            parameter.valueDeclaration,
          );

          if (isIntersectionType(parameterType)) {
            visitIntersectionType(
              parameterType,
              checker,
              ctx[variableName],
              parameter.valueDeclaration,
            );
          } else if (isObjectType(parameterType)) {
            visitObjectType(
              parameterType,
              checker,
              ctx[variableName],
              parameter.valueDeclaration,
            );
          }
        }
      }
    }
  } else if (ts.isFunctionDeclaration(node)) {
    // ignore anonymous functions
    if (!node.name) {
      return;
    }

    const functionName = node.name.getText();

    ctx[functionName] = { properties: [] };

    visitFunctionParameters(node, checker, ctx[functionName]);
  }
}

function printDiagnostics(program: ts.Program) {
  const configFileDiagnostics = program.getConfigFileParsingDiagnostics();
  const optionsDiagnostics = program.getOptionsDiagnostics();
  const globalDiagnostics = program.getGlobalDiagnostics();
  const semanticDiagnostics = program.getSemanticDiagnostics();
  const syntacticDiagnostics = program.getSyntacticDiagnostics();
  const declarationDiagnostics = program.getDeclarationDiagnostics();

  if (configFileDiagnostics.length > 0) {
    console.log(configFileDiagnostics);
  }

  if (optionsDiagnostics.length > 0) {
    console.log(optionsDiagnostics);
  }

  if (globalDiagnostics.length > 0) {
    console.log(globalDiagnostics);
  }

  if (semanticDiagnostics.length > 0) {
    console.log(semanticDiagnostics);
  }

  if (syntacticDiagnostics.length > 0) {
    console.log(syntacticDiagnostics);
  }

  if (declarationDiagnostics.length > 0) {
    console.log(declarationDiagnostics);
  }
}

export function extractFromFile(fileName: string): VisitorContext {
  const program = ts.createProgram(options);
  const checker = program.getTypeChecker();

  printDiagnostics(program);

  // construct a map of components to properties
  const ctx: VisitorContext = {};
  const sourceFile = program.getSourceFile(fileName);

  if (!sourceFile) {
    throw new Error(`File ${fileName} not found`);
  }

  ts.forEachChild(sourceFile, child => visit(child, checker, ctx));

  return ctx;
}

export function createProgram(): VisitorContext {
  const program = ts.createProgram(options);
  const checker = program.getTypeChecker();

  printDiagnostics(program);

  // construct a map of components to properties
  const ctx: VisitorContext = {};
  const srcDir = path.resolve(__dirname, '../../visage/src');

  for (const sourceFile of program.getSourceFiles()) {
    if (
      sourceFile.fileName.startsWith(srcDir) &&
      !sourceFile.fileName.includes('__tests__')
    ) {
      ts.forEachChild(sourceFile, child => visit(child, checker, ctx));
    }
  }

  return ctx;
}
