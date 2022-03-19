export type Color = "default" | number | [number, number, number];

export type Sgr = {
  reset?: true;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
  blinking?: boolean;
  inverse?: boolean;
  conceal?: boolean;
  strike?: boolean;
  foreground?: Color;
  background?: Color;
};

/**
 * Parse SGR parameters and return `Sgr` object
 */
export function parseSgr(parameters: string): Sgr {
  const sgr: Sgr = {};
  const ps: [RegExp, (m: RegExpMatchArray) => void][] = [
    [
      /^38;2;(\d*);(\d*);(\d*);/,
      (m) =>
        sgr.foreground = [
          Number(m[1] || 0),
          Number(m[2] || 0),
          Number(m[3] || 0),
        ],
    ],
    [
      /^48;2;(\d*);(\d*);(\d*);/,
      (m) =>
        sgr.background = [
          Number(m[1] || 0),
          Number(m[2] || 0),
          Number(m[3] || 0),
        ],
    ],
    [/^38;5;(\d*);/, (m) => sgr.foreground = Number(m[1] || 0)],
    [/^48;5;(\d*);/, (m) => sgr.background = Number(m[1] || 0)],
    [/^39;/, () => sgr.foreground = "default"],
    [/^49;/, () => sgr.background = "default"],
    [/^3([0-7]);/, (m) => sgr.foreground = Number(m[1])],
    [/^4([0-7]);/, (m) => sgr.background = Number(m[1])],
    [/^9([0-7]);/, (m) => sgr.foreground = Number(m[1]) + 8],
    [/^10([0-7]);/, (m) => sgr.background = Number(m[1]) + 8],
    [/^0?;/, () => sgr.reset = true],
    [/^1;/, () => sgr.bold = true],
    [/^2;/, () => sgr.dim = true],
    [/^3;/, () => sgr.italic = true],
    [/^4;/, () => sgr.underline = true],
    [/^5;/, () => sgr.blinking = true],
    [/^7;/, () => sgr.inverse = true],
    [/^8;/, () => sgr.conceal = true],
    [/^9;/, () => sgr.strike = true],
    [/^22;/, () => {
      sgr.bold = false;
      sgr.dim = false;
    }],
    [/^23;/, () => sgr.italic = false],
    [/^24;/, () => sgr.underline = false],
    [/^25;/, () => sgr.blinking = false],
    [/^27;/, () => sgr.inverse = false],
    [/^28;/, () => sgr.conceal = false],
    [/^29;/, () => sgr.strike = false],
    [/^[^;]*;/, () => {}],
  ];
  parameters = `${parameters};`;
  while (parameters) {
    for (const [p, handler] of ps) {
      const m = parameters.match(p);
      if (m) {
        handler(m);
        parameters = parameters.substring(m[0].length);
        break;
      }
    }
  }
  return sgr;
}
