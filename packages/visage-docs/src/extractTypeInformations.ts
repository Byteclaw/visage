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

interface VisitorContext {
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

function isGenericObjectType(type: ts.ObjectType): type is ts.TypeReference {
  return type.objectFlags === ts.ObjectFlags.Reference;
}

function visitObjectType(
  type: ts.Type,
  checker: ts.TypeChecker,
  ctx: ObjectTypeVisitorContext,
) {
  type.getProperties().forEach(property => {
    const { parent } = (property as any) as ts.Symbol & { parent?: ts.Symbol };

    ctx.properties.push({
      parent: parent ? (parent as ts.Symbol).getName() : undefined,
      name: property.getName(),
      // eslint-disable-next-line no-bitwise
      isOptional: (property.flags & ts.SymbolFlags.Optional) !== 0,
      documentation: ts.displayPartsToString(
        property.getDocumentationComment(checker),
      ),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration),
      ),
    });
  });
}

function visitGenericObjectTypeArguments(
  type: ts.TypeReference,
  checker: ts.TypeChecker,
  ctx: ObjectTypeVisitorContext,
) {
  const args = checker.getTypeArguments(type);

  args.forEach(arg => visitObjectType(arg, checker, ctx));
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

    visitObjectType(type, checker, ctx);
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

      if (!isObjectType(type) || !isGenericObjectType(type)) {
        // skip non object/non generic types
        return;
      }

      const variableName = node.name.getText();

      ctx[variableName] = {
        properties: [],
      };

      visitGenericObjectTypeArguments(type, checker, ctx[variableName]);
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

export function createProgram(): VisitorContext {
  const program = ts.createProgram(options);
  const checker = program.getTypeChecker();

  console.log(program.getConfigFileParsingDiagnostics());
  console.log(program.getOptionsDiagnostics());
  console.log(program.getGlobalDiagnostics());
  console.log(program.getSemanticDiagnostics());
  console.log(program.getSyntacticDiagnostics());
  console.log(program.getDeclarationDiagnostics());

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
