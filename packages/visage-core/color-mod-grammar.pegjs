{
    // this is taken from https://github.com/ianstormtaylor/css-color-function/blob/master/lib/adjusters.js
    const rgbVal = (value: any) => value.type === 'percentage'  ? value.value * 255 : value.value;
    const contrast = (ctx: any, colorLib: any, source: any, op: any) => {
        if (!op.value) {
            op.value = { type: 'percentage', value: 100 }
        }

        const percentage = op.value.value;
        const max = colorLib(source.luminosity() < 0.5 
            ? { h: source.hue(), w: 100, b: 0 } 
            : { h: source.hue(), w: 0, b: 100 }
        )
        const minRatio = 4.5;
        let min = max;

        if (source.contrast(max) > minRatio) {
            min = binarySearchBWContrast(minRatio, source, max);
            
            const targetMinAlpha = min.alpha();

            min = min.alpha(1).mix(max, percentage / 100).alpha(targetMinAlpha)
        }
        
        return min
    };
    const binarySearchBWContrast = (minRatio: any, color: any, max: any) => {
        const hue = color.hue();
        let min = color;
        let minW = color.white();
        let minB = color.wblack();
        let maxW = max.white();
        let maxB = max.wblack();
        let steps = 0;

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

        return min
    };
    const modify = (value: any, op: any) => {
        switch (op.modifier) {
            case '+': return value + op.value.value;
            case '-': return value - op.value.value;
            default: return op.value.value;
        }
    };
    const alpha = (ctx: any, colorLib: any, source: any, op: any) => {
        if (op.value.type === 'percentage') {
            op.value = { value: op.value.value / 100}
        }

        return source.alpha(modify(source.alpha(), op));
    };
    const createOp = (prop: any) => (ctx: any, colorLib: any, source: any, op: any) => source[prop](modify(source[prop](), op));
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

        return source.alpha(1).mix(op.color(ctx, colorLib), op.value.value / 100).alpha(targetAlpha);
    };
    const ifClause = (ctx: any, colorLib: any, source: any, op: any) => {
        if (source[op.predicate]()) {
            return op.ifLeaf(ctx, colorLib)
        } else if (op.elseLeaf) {
            return op.elseLeaf(ctx, colorLib);
        }

        return source;
    };
    const ifContrast = (ctx: any, colorLib: any, source: any, op: any) => ifClause(
        ctx, 
        colorLib, 
        source, 
        { predicate: op.op === 'ifDark' ? 'isDark' : 'isLight', ifLeaf: op.color },
    );

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
        'if': ifClause,
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
                return operations[op.op as any as keyof typeof operations](ctx, colorLib, res, op);
            }, source);
        };
    }
}

Start = col:(ColorFunction / Color) { 
    return (ctx: any, colorLib: any) => col(ctx, colorLib).rgb().toString();
}
Color = ColorRGB / ColorHSL / ColorHex / ColorIdentifier
ColorFunction = "color(" _ color:Color ops:Adj* ")" { 
    return createProcessFn(color, ops); 
}
ColorHex = c:$("#" ColorHex3 ColorHex3?) { 
    return (ctx: any, colorLib: any) => colorLib(c);
}
ColorIdentifier = c:$(Identifier ColorShade?) { 
    return (ctx: any, colorLib: any) => colorLib(ctx.resolve('colors', c, ctx)); 
}
ColorHex3 = HexChar HexChar HexChar
ColorRGB = ("rgba" / "rgb") "(" _ r:NumOrPercent _ g:NumOrPercent _ b:NumOrPercent _ a:Number? _ ")" {
    return (ctx: any, colorLib: any) => colorLib.rgb(rgbVal(r), rgbVal(g), rgbVal(b), a == null ? 1 : a.value);
}
ColorHSL = ("hsla" / "hsl") "(" _ h:Number _ s:Percentage _ l:Percentage _ a:Number? _ ")" {
    return (ctx: any, colorLib: any) => colorLib.hsl(h.value, s.value, l.value, a == null ? 1 : a.value);
}

Adj = _ a:(AdjAlpha / AdjHue / AdjCol / AdjColPerc / AdjContrast / AdjIf / AdjPosPercentage / AdjPercentage) _ { return a; }
AdjIf = "if(" _ predicate:("isDark" / "isLight") _ ifLeaf:(ColorFunction / Color) _ elseLeaf:(ColorFunction / Color)? _ ")" {
    return {
        op: 'if',
        predicate,
        ifLeaf,
        elseLeaf,
    }
}
AdjAlpha = op:("alpha" / "a") "(" _ modifier:Modifier? _ value:(Percentage / Number) _ ")" { return { op, modifier, value }; }
AdjHue = op:("hue" / "h") "(" _ modifier:Modifier? _ value:Number _ ")" { return { op, modifier, value }; }
AdjPosPercentage = op:("shade" / "tint") "(" _ value:Percentage _ ")" { 
    return { 
        op: 'blend', 
        color: (ctx: any, colorLib: any) => op === 'shade' ? colorLib.rgb(0, 0, 0) : colorLib.rgb(255, 255, 255), 
        value,
    };
}
AdjPercentage = op:("blackness" / "lightness" / "saturation" / "whiteness" / "b" / "l" / "s" / "w") "(" _ modifier:Modifier? _ value:Percentage _ ")" { 
    return { op, modifier, value };
}
AdjCol = op:("ifDark" / "ifLight") "(" _ color:(ColorFunction / Color) _ ")" { return { op, color }; }
AdjColPerc = op:("blenda" / "blend") "(" _ color:(ColorFunction / Color) _ value:Percentage _ ")" { return { op, color, value }; }
AdjContrast = op:"contrast" "(" _ value:Percentage? _ ")" { return { op, value }; }

ColorShade = $("." "-"? [0-9]+)
HexChar = [0-9a-fA-F]
Modifier = "+" / "-"
NumOrPercent = Percentage / Number
Percentage = Number "%" { return { type: 'percentage', value: parseInt(text(), 10) }; }
Number = [0-9]+ ("." [0-9]+)? { return { type: 'number', value: parseFloat(text()) }; }
Identifier = $[a-zA-Z]+

_ "whitespace" = [ \t\n\r,]*