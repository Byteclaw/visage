start = "none" / "initial" / "inherit" / "unset" / bss:boxShadow+ { return bss; }

boxShadow = boxShadow4 / boxShadow3 / boxShadow2
boxShadow4 = _ "inset"? _ offset _ offset _ offset _ offset _ col:color { return { color: col }; }
boxShadow3 = _ "inset"? _ offset _ offset _ offset _ col:color { return { color: col }; }
boxShadow2 = _ "inset"? _ offset _ offset _ col:color { return { color: col }; }

color = col:$(colorMod / colorFn / colorHex / colorWord)
colorFn = ("rgb" / "hsl") "a"? "(" _ nop _ nop _ nop _ n? _ ")"
colorMod = "color(" _ color _ adj* _")"
colorHex = "#" ((h h h h h h) / (h h h))
colorWord = $([a-zA-Z]+ ("." "-"? [0-9]+)?)
offset = (("-"? n) / ("."[0-9]+)) [a-zA-Z]*
adj = _ (adjIf / adjIfCol / adjNum) _
adjNum = [a-z]+ "(" _ ("+" / "-")? _ nop? _ ")"
adjIf = "if(" _ [a-zA-Z]+ _ (colorMod / colorFn / colorHex / colorWord) _ (colorMod / colorFn / colorHex / colorWord)? _ ")"
adjIfCol = ("ifDark" / "ifLight" / "blenda" / "blend") "(" _ (colorMod / colorFn / colorHex / colorWord ) _ np? _ ")"
h = [0-9a-fA-F]
n = [0-9]+ ("." [0-9]+)?
np = n "%"
nop = np / n

_ "whitespace" = [ \t\n\r,]*