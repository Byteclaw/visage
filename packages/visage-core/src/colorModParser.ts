// tslint:disable:only-arrow-functions
// tslint:disable:object-literal-shorthand
// tslint:disable:trailing-comma
// tslint:disable:object-literal-sort-keys
// tslint:disable:one-variable-per-declaration
// tslint:disable:max-line-length
// tslint:disable:no-consecutive-blank-lines
// tslint:disable:align

// Generated by PEG.js v. 0.10.0 (ts-pegjs plugin v. 0.2.7 )
//
// https://pegjs.org/   https://github.com/metadevpro/ts-pegjs

export interface IFilePosition {
  offset: number;
  line: number;
  column: number;
}

export interface IFileRange {
  start: IFilePosition;
  end: IFilePosition;
}

export interface ILiteralExpectation {
  type: 'literal';
  text: string;
  ignoreCase: boolean;
}

export interface IClassParts extends Array<string | IClassParts> {}

export interface IClassExpectation {
  type: 'class';
  parts: IClassParts;
  inverted: boolean;
  ignoreCase: boolean;
}

export interface IAnyExpectation {
  type: 'any';
}

export interface IEndExpectation {
  type: 'end';
}

export interface IOtherExpectation {
  type: 'other';
  description: string;
}

export type Expectation =
  | ILiteralExpectation
  | IClassExpectation
  | IAnyExpectation
  | IEndExpectation
  | IOtherExpectation;

export class SyntaxError extends Error {
  public static buildMessage(expected: Expectation[], found: string | null) {
    function hex(ch: string): string {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s: string): string {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g, ch => `\\x0${hex(ch)}`)
        .replace(/[\x10-\x1F\x7F-\x9F]/g, ch => `\\x${hex(ch)}`);
    }

    function classEscape(s: string): string {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g, '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g, ch => `\\x0${hex(ch)}`)
        .replace(/[\x10-\x1F\x7F-\x9F]/g, ch => `\\x${hex(ch)}`);
    }

    function describeExpectation(expectation: Expectation) {
      switch (expectation.type) {
        case 'literal':
          return `"${literalEscape(expectation.text)}"`;
        case 'class':
          const escapedParts = expectation.parts.map(part => {
            return Array.isArray(part)
              ? `${classEscape(part[0] as string)}-${classEscape(
                  part[1] as string,
                )}`
              : classEscape(part);
          });

          return `[${expectation.inverted ? '^' : ''}${escapedParts}]`;
        case 'any':
          return 'any character';
        case 'end':
          return 'end of input';
        case 'other':
          return expectation.description;
      }
    }

    function describeExpected(expected1: Expectation[]) {
      const descriptions = expected1.map(describeExpectation);
      let i: number;
      let j: number;

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return `${descriptions[0]} or ${descriptions[1]}`;

        default:
          return `${descriptions.slice(0, -1).join(', ')}, or ${
            descriptions[descriptions.length - 1]
          }`;
      }
    }

    function describeFound(found1: string | null) {
      return found1 ? `"${literalEscape(found1)}"` : 'end of input';
    }

    return `Expected ${describeExpected(expected)} but ${describeFound(
      found,
    )} found.`;
  }

  public message: string;

  public expected: Expectation[];

  public found: string | null;

  public location: IFileRange;

  public name: string;

  constructor(
    message: string,
    expected: Expectation[],
    found: string | null,
    location: IFileRange,
  ) {
    super();
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = 'SyntaxError';

    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, SyntaxError);
    }
  }
}

function peg$parse(input: string, options?: IParseOptions) {
  options = options !== undefined ? options : {};

  const peg$FAILED: Readonly<{}> = {};

  const peg$startRuleIndices: { [id: string]: number } = { Start: 0 };
  let peg$startRuleIndex = 0;

  const peg$consts = [
    function (col: any): any {
      return (ctx: any, colorLib: any) => col(ctx, colorLib).rgb().toString();
    },
    'color(',
    peg$literalExpectation('color(', false),
    ')',
    peg$literalExpectation(')', false),
    function (color: any, ops: any): any {
      return createProcessFn(color, ops);
    },
    '#',
    peg$literalExpectation('#', false),
    function (c: any): any {
      return (ctx: any, colorLib: any) => colorLib(c);
    },
    function (c: any): any {
      return (ctx: any, colorLib: any) =>
        colorLib(ctx.resolve('colors', c, ctx));
    },
    'rgba',
    peg$literalExpectation('rgba', false),
    'rgb',
    peg$literalExpectation('rgb', false),
    '(',
    peg$literalExpectation('(', false),
    function (r: any, g: any, b: any, a: any): any {
      return (ctx: any, colorLib: any) =>
        colorLib.rgb(rgbVal(r), rgbVal(g), rgbVal(b), a == null ? 1 : a.value);
    },
    'hsla',
    peg$literalExpectation('hsla', false),
    'hsl',
    peg$literalExpectation('hsl', false),
    function (h: any, s: any, l: any, a: any): any {
      return (ctx: any, colorLib: any) =>
        colorLib.hsl(h.value, s.value, l.value, a == null ? 1 : a.value);
    },
    function (a: any): any {
      return a;
    },
    'if(',
    peg$literalExpectation('if(', false),
    'isDark',
    peg$literalExpectation('isDark', false),
    'isLight',
    peg$literalExpectation('isLight', false),
    function (predicate: any, ifLeaf: any, elseLeaf: any): any {
      return {
        op: 'if',
        predicate,
        ifLeaf,
        elseLeaf,
      };
    },
    'alpha',
    peg$literalExpectation('alpha', false),
    'a',
    peg$literalExpectation('a', false),
    function (op: any, modifier: any, value: any): any {
      return { op, modifier, value };
    },
    'hue',
    peg$literalExpectation('hue', false),
    'h',
    peg$literalExpectation('h', false),
    'shade',
    peg$literalExpectation('shade', false),
    'tint',
    peg$literalExpectation('tint', false),
    function (op: any, value: any): any {
      return {
        op: 'blend',
        color: (ctx: any, colorLib: any) =>
          op === 'shade' ? colorLib.rgb(0, 0, 0) : colorLib.rgb(255, 255, 255),
        value,
      };
    },
    'blackness',
    peg$literalExpectation('blackness', false),
    'lightness',
    peg$literalExpectation('lightness', false),
    'saturation',
    peg$literalExpectation('saturation', false),
    'whiteness',
    peg$literalExpectation('whiteness', false),
    'b',
    peg$literalExpectation('b', false),
    'l',
    peg$literalExpectation('l', false),
    's',
    peg$literalExpectation('s', false),
    'w',
    peg$literalExpectation('w', false),
    function (op: any, modifier: any, value: any): any {
      return { op, modifier, value };
    },
    'ifDark',
    peg$literalExpectation('ifDark', false),
    'ifLight',
    peg$literalExpectation('ifLight', false),
    function (op: any, color: any): any {
      return { op, color };
    },
    'blenda',
    peg$literalExpectation('blenda', false),
    'blend',
    peg$literalExpectation('blend', false),
    function (op: any, color: any, value: any): any {
      return { op, color, value };
    },
    'contrast',
    peg$literalExpectation('contrast', false),
    function (op: any, value: any): any {
      return { op, value };
    },
    '.',
    peg$literalExpectation('.', false),
    '-',
    peg$literalExpectation('-', false),
    /^[0-9]/,
    peg$classExpectation([['0', '9']], false, false),
    /^[0-9a-fA-F]/,
    peg$classExpectation(
      [
        ['0', '9'],
        ['a', 'f'],
        ['A', 'F'],
      ],
      false,
      false,
    ),
    '+',
    peg$literalExpectation('+', false),
    '%',
    peg$literalExpectation('%', false),
    function (): any {
      return { type: 'percentage', value: parseInt(text(), 10) };
    },
    function (): any {
      return { type: 'number', value: parseFloat(text()) };
    },
    /^[a-zA-Z\-_]/,
    peg$classExpectation([['a', 'z'], ['A', 'Z'], '-', '_'], false, false),
    peg$otherExpectation('whitespace'),
    /^[ \t\n\r,]/,
    peg$classExpectation([' ', '\t', '\n', '\r', ','], false, false),
  ];

  const peg$bytecode = [
    peg$decode('%;".# &;!/\' 8!: !! )'),
    peg$decode(";&./ &;'.) &;#.# &;$"),
    peg$decode(
      '%2!""6!7"/Z#;8/Q$;!/H$$;(0#*;(&/8$2#""6#7$/)$8%:%%""!)(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%%%2&""6&7\'/:#;%/1$;%." &"/#$+#)(#\'#("\'#&\'#/"!&,)/\' 8!:(!! )',
    ),
    peg$decode('%%%;7/1#;1." &"/#$+")("\'#&\'#/"!&,)/\' 8!:)!! )'),
    peg$decode("%;2/5#;2/,$;2/#$+#)(#'#(\"'#&'#"),
    peg$decode(
      "%2*\"\"6*7+.) &2,\"\"6,7-/\x9F#2.\"\"6.7//\x90$;8/\x87$;4/~$;8/u$;4/l$;8/c$;4/Z$;8/Q$;6.\" &\"/C$;8/:$2#\"\"6#7$/+$8,:0,$(&$\")(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#",
    ),
    peg$decode(
      "%21\"\"6172.) &23\"\"6374/\x9F#2.\"\"6.7//\x90$;8/\x87$;6/~$;8/u$;5/l$;8/c$;5/Z$;8/Q$;6.\" &\"/C$;8/:$2#\"\"6#7$/+$8,:5,$(&$\")(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#",
    ),
    peg$decode(
      "%;8/d#;*.G &;+.A &;..; &;/.5 &;0./ &;).) &;,.# &;-/1$;8/($8#:6#!!)(#'#(\"'#&'#",
    ),
    peg$decode(
      '%27""6778/\x9B#;8/\x92$29""697:.) &2;""6;7</w$;8/n$;".# &;!/_$;8/V$;".# &;!." &"/B$;8/9$2#""6#7$/*$8):=)#&$")()\'#((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%2>""6>7?.) &2@""6@7A/\x80#2.""6.7//q$;8/h$;3." &"/Z$;8/Q$;5.# &;6/B$;8/9$2#""6#7$/*$8(:B(#\'$")((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%2C""6C7D.) &2E""6E7F/z#2.""6.7//k$;8/b$;3." &"/T$;8/K$;6/B$;8/9$2#""6#7$/*$8(:B(#\'$")((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%2G""6G7H.) &2I""6I7J/b#2.""6.7//S$;8/J$;5/A$;8/8$2#""6#7$/)$8&:K&"%")(&\'#(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%2L""6L7M.q &2N""6N7O.e &2P""6P7Q.Y &2R""6R7S.M &2T""6T7U.A &2V""6V7W.5 &2X""6X7Y.) &2Z""6Z7[/z#2.""6.7//k$;8/b$;3." &"/T$;8/K$;5/B$;8/9$2#""6#7$/*$8(:\\(#\'$")((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%2]""6]7^.) &2_""6_7`/h#2.""6.7//Y$;8/P$;".# &;!/A$;8/8$2#""6#7$/)$8&:a&"%")(&\'#(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%2b""6b7c.) &2d""6d7e/{#2.""6.7//l$;8/c$;".# &;!/T$;8/K$;5/B$;8/9$2#""6#7$/*$8(:f(#\'$")((\'#(\'\'#(&\'#(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%2g""6g7h/g#2.""6.7//X$;8/O$;5." &"/A$;8/8$2#""6#7$/)$8&:i&"%")(&\'#(%\'#($\'#(#\'#("\'#&\'#',
    ),
    peg$decode(
      '%%2j""6j7k/Y#2l""6l7m." &"/E$$4n""5!7o/,#0)*4n""5!7o&&&#/#$+#)(#\'#("\'#&\'#/"!&,)',
    ),
    peg$decode('4p""5!7q'),
    peg$decode('2r""6r7s.) &2l""6l7m'),
    peg$decode(';5.# &;6'),
    peg$decode('%;6/6#2t""6t7u/\'$8":v" )("\'#&\'#'),
    peg$decode(
      '%$4n""5!7o/,#0)*4n""5!7o&&&#/g#%2j""6j7k/E#$4n""5!7o/,#0)*4n""5!7o&&&#/#$+")("\'#&\'#." &"/\'$8":w" )("\'#&\'#',
    ),
    peg$decode('%$4x""5!7y/,#0)*4x""5!7y&&&#/"!&,)'),
    peg$decode('<$4{""5!7|0)*4{""5!7|&=." 7z'),
  ];

  let peg$currPos = 0;
  let peg$savedPos = 0;
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailPos = 0;
  let peg$maxFailExpected: Expectation[] = [];
  let peg$silentFails = 0;

  let peg$result;

  if (options.startRule !== undefined) {
    if (!(options.startRule in peg$startRuleIndices)) {
      throw new Error(`Can't start parsing from rule "${options.startRule}".`);
    }

    peg$startRuleIndex = peg$startRuleIndices[options.startRule];
  }

  function text(): string {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location(): IFileRange {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description: string, location1?: IFileRange) {
    location1 =
      location1 !== undefined
        ? location1
        : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location1,
    );
  }

  function error(message: string, location1?: IFileRange) {
    location1 =
      location1 !== undefined
        ? location1
        : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location1);
  }

  function peg$literalExpectation(
    text1: string,
    ignoreCase: boolean,
  ): ILiteralExpectation {
    return { type: 'literal', text: text1, ignoreCase };
  }

  function peg$classExpectation(
    parts: IClassParts,
    inverted: boolean,
    ignoreCase: boolean,
  ): IClassExpectation {
    return {
      type: 'class',
      parts,
      inverted,
      ignoreCase,
    };
  }

  function peg$anyExpectation(): IAnyExpectation {
    return { type: 'any' };
  }

  function peg$endExpectation(): IEndExpectation {
    return { type: 'end' };
  }

  function peg$otherExpectation(description: string): IOtherExpectation {
    return { type: 'other', description };
  }

  function peg$computePosDetails(pos: number) {
    let details = peg$posDetailsCache[pos];
    let p;

    if (details) {
      return details;
    }
    p = pos - 1;
    while (!peg$posDetailsCache[p]) {
      p--;
    }

    details = peg$posDetailsCache[p];
    details = {
      line: details.line,
      column: details.column,
    };

    while (p < pos) {
      if (input.charCodeAt(p) === 10) {
        details.line++;
        details.column = 1;
      } else {
        details.column++;
      }

      p++;
    }

    peg$posDetailsCache[pos] = details;

    return details;
  }

  function peg$computeLocation(startPos: number, endPos: number): IFileRange {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column,
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column,
      },
    };
  }

  function peg$fail(expected1: Expectation) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected1);
  }

  function peg$buildSimpleError(message: string, location1: IFileRange) {
    return new SyntaxError(message, [], '', location1);
  }

  function peg$buildStructuredError(
    expected1: Expectation[],
    found: string | null,
    location1: IFileRange,
  ) {
    return new SyntaxError(
      SyntaxError.buildMessage(expected1, found),
      expected1,
      found,
      location1,
    );
  }

  function peg$decode(s: string): number[] {
    return s.split('').map(ch => ch.charCodeAt(0) - 32);
  }

  function peg$parseRule(index: number): any {
    const bc = peg$bytecode[index];
    let ip = 0;
    const ips: any[] = [];
    let end = bc.length;
    const ends: any[] = [];
    const stack: any[] = [];
    let params;

    while (true) {
      while (ip < end) {
        switch (bc[ip]) {
          case 0:
            stack.push(peg$consts[bc[ip + 1]]);
            ip += 2;
            break;

          case 1:
            stack.push(undefined);
            ip++;
            break;

          case 2:
            stack.push(null);
            ip++;
            break;

          case 3:
            stack.push(peg$FAILED);
            ip++;
            break;

          case 4:
            stack.push([]);
            ip++;
            break;

          case 5:
            stack.push(peg$currPos);
            ip++;
            break;

          case 6:
            stack.pop();
            ip++;
            break;

          case 7:
            peg$currPos = stack.pop();
            ip++;
            break;

          case 8:
            stack.length -= bc[ip + 1];
            ip += 2;
            break;

          case 9:
            stack.splice(-2, 1);
            ip++;
            break;

          case 10:
            stack[stack.length - 2].push(stack.pop());
            ip++;
            break;

          case 11:
            stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
            ip += 2;
            break;

          case 12:
            stack.push(input.substring(stack.pop(), peg$currPos));
            ip++;
            break;

          case 13:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1]) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 14:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1] === peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 15:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1] !== peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 16:
            if (stack[stack.length - 1] !== peg$FAILED) {
              ends.push(end);
              ips.push(ip);

              end = ip + 2 + bc[ip + 1];
              ip += 2;
            } else {
              ip += 2 + bc[ip + 1];
            }

            break;

          case 17:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (input.length > peg$currPos) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 18:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (
              input.substr(
                peg$currPos,
                (peg$consts[bc[ip + 1]] as string).length,
              ) === peg$consts[bc[ip + 1]]
            ) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 19:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (
              input
                .substr(peg$currPos, (peg$consts[bc[ip + 1]] as string).length)
                .toLowerCase() === peg$consts[bc[ip + 1]]
            ) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 20:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (
              (peg$consts[bc[ip + 1]] as RegExp).test(input.charAt(peg$currPos))
            ) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 21:
            stack.push(input.substr(peg$currPos, bc[ip + 1]));
            peg$currPos += bc[ip + 1];
            ip += 2;
            break;

          case 22:
            stack.push(peg$consts[bc[ip + 1]]);
            peg$currPos += (peg$consts[bc[ip + 1]] as string).length;
            ip += 2;
            break;

          case 23:
            stack.push(peg$FAILED);
            if (peg$silentFails === 0) {
              peg$fail(peg$consts[bc[ip + 1]] as ILiteralExpectation);
            }
            ip += 2;
            break;

          case 24:
            peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
            ip += 2;
            break;

          case 25:
            peg$savedPos = peg$currPos;
            ip++;
            break;

          case 26:
            params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]).map(function (p) {
              return stack[stack.length - 1 - p];
            });

            stack.splice(
              stack.length - bc[ip + 2],
              bc[ip + 2],
              (peg$consts[bc[ip + 1]] as (...args: any[]) => any).apply(
                null,
                params,
              ),
            );

            ip += 4 + bc[ip + 3];
            break;

          case 27:
            stack.push(peg$parseRule(bc[ip + 1]));
            ip += 2;
            break;

          case 28:
            peg$silentFails++;
            ip++;
            break;

          case 29:
            peg$silentFails--;
            ip++;
            break;

          default:
            throw new Error(`Invalid opcode: ${bc[ip]}.`);
        }
      }

      if (ends.length > 0) {
        end = ends.pop();
        ip = ips.pop();
      } else {
        break;
      }
    }

    return stack[0];
  }

  // this is taken from https://github.com/ianstormtaylor/css-color-function/blob/master/lib/adjusters.js
  const rgbVal = (value: any) =>
    value.type === 'percentage' ? value.value * 255 : value.value;
  const contrast = (ctx: any, colorLib: any, source: any, op: any) => {
    if (!op.value) {
      op.value = { type: 'percentage', value: 100 };
    }

    const percentage = op.value.value;
    const max = colorLib(
      source.luminosity() < 0.5
        ? { h: source.hue(), w: 100, b: 0 }
        : { h: source.hue(), w: 0, b: 100 },
    );
    const minRatio = 4.5;
    let min = max;

    if (source.contrast(max) > minRatio) {
      min = binarySearchBWContrast(minRatio, source, max);

      const targetMinAlpha = min.alpha();

      min = min
        .alpha(1)
        .mix(max, percentage / 100)
        .alpha(targetMinAlpha);
    }

    return min;
  };
  const binarySearchBWContrast = (minRatio: any, color: any, max: any) => {
    const hue = color.hue();
    let min = color;
    let minW = color.white();
    let minB = color.wblack();
    let maxW = max.white();
    let maxB = max.wblack();
    const steps = 0;

    while (Math.abs(minW - maxW) > 1 || Math.abs(minB - maxB) > 1) {
      const midW = Math.round((maxW + minW) / 2);
      const midB = Math.round((maxB + minB) / 2);

      min = min.white(midW).wblack(midB);

      if (min.contrast(color) > minRatio) {
        maxW = midW;
        maxB = midB;
      } else {
        minW = midW;
        minB = midB;
      }
    }

    return min;
  };
  const modify = (value: any, op: any) => {
    switch (op.modifier) {
      case '+':
        return value + op.value.value;
      case '-':
        return value - op.value.value;
      default:
        return op.value.value;
    }
  };
  const alpha = (ctx: any, colorLib: any, source: any, op: any) => {
    if (op.value.type === 'percentage') {
      op.value = { value: op.value.value / 100 };
    }

    return source.alpha(modify(source.alpha(), op));
  };
  const createOp = (prop: any) => (
    ctx: any,
    colorLib: any,
    source: any,
    op: any,
  ) => source[prop](modify(source[prop](), op));
  const hue = createOp('hue');
  const blackness = createOp('wblack');
  const lightness = createOp('lightness');
  const saturation = createOp('saturationl');
  const whiteness = createOp('white');
  const blend = (ctx: any, colorLib: any, source: any, op: any) => {
    if (op.op === 'blenda') {
      return source.mix(op.color(ctx, colorLib), op.value.value / 100);
    }

    const targetAlpha = source.alpha();

    return source
      .alpha(1)
      .mix(op.color(ctx, colorLib), op.value.value / 100)
      .alpha(targetAlpha);
  };
  const ifClause = (ctx: any, colorLib: any, source: any, op: any) => {
    if (source[op.predicate]()) {
      return op.ifLeaf(ctx, colorLib);
    }
    if (op.elseLeaf) {
      return op.elseLeaf(ctx, colorLib);
    }

    return source;
  };
  const ifContrast = (ctx: any, colorLib: any, source: any, op: any) =>
    ifClause(ctx, colorLib, source, {
      predicate: op.op === 'ifDark' ? 'isDark' : 'isLight',
      ifLeaf: op.color,
    });

  const operations = {
    a: alpha,
    alpha,
    b: blackness,
    blackness,
    blend,
    blenda: blend,
    contrast,
    h: hue,
    hue,
    if: ifClause,
    ifDark: ifContrast,
    ifLight: ifContrast,
    l: lightness,
    lightness,
    s: saturation,
    saturation,
    shade: blend,
    tint: blend,
    w: whiteness,
    whiteness,
  };

  function createProcessFn(color: any, ops: any) {
    return (ctx: any, colorLib: any) => {
      const source = colorLib(color(ctx, colorLib));

      return ops.reduce((res: any, op: any) => {
        return operations[(op.op as any) as keyof typeof operations](
          ctx,
          colorLib,
          res,
          op,
        );
      }, source);
    };
  }

  peg$result = peg$parseRule(peg$startRuleIndex);

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  }
  if (peg$result !== peg$FAILED && peg$currPos < input.length) {
    peg$fail(peg$endExpectation());
  }

  throw peg$buildStructuredError(
    peg$maxFailExpected,
    peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
    peg$maxFailPos < input.length
      ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
      : peg$computeLocation(peg$maxFailPos, peg$maxFailPos),
  );
}

export interface IParseOptions {
  filename?: string;
  startRule?: string;
  tracer?: any;
  [key: string]: any;
}
export type ParseFunction = (input: string, options?: IParseOptions) => any;
export const parse: ParseFunction = peg$parse;
