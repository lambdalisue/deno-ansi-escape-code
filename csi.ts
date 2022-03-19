import { parseSgr, Sgr } from "./sgr.ts";

export const patternCsi =
  // deno-lint-ignore no-control-regex
  /\x1b\[([0-9:;<=>?]*[!"#$%&'()*+,-.\/]*[@A-Z\[\]\\^_`a-z{|}~])/;

export type Csi = {
  /** Cursor Up */
  cuu?: number;
  /** Cursor Down */
  cud?: number;
  /** Cursor Forward */
  cuf?: number;
  /** Cursor Back */
  cub?: number;
  /** Cursor Next Line */
  cnl?: number;
  /** Cursor Previous Line */
  cpl?: number;
  /** Cursor Horizontal Absolute */
  cha?: number;
  /** Cursor Position */
  cup?: [number, number];
  /** Erase in Display */
  ed?: number;
  /** Erase in Line */
  el?: number;
  /** Scroll Up */
  su?: number;
  /** Scroll Down */
  sd?: number;
  /** Horizontal Vertical Position */
  hvp?: [number, number];
  /** Select Graphic Rendition */
  sgr?: Sgr;
  /** Device Status Report */
  dsr?: true;
};

/**
 * Parse CSI sequence and return `Csi` object
 *
 * It throws an error when `sequence` is not CSI sequence.
 */
export function parseCsi(sequence: string): Csi {
  const m = sequence.match(patternCsi);
  if (!m) {
    throw new Error(`Failed to parse CSI sequence '${sequence}'`);
  }
  let expr = m[1];
  const csi: Csi = {};
  const ps: [RegExp, (m: RegExpMatchArray) => void][] = [
    [/(\d*)A/, (m) => csi.cuu = Number(m[1] || 1)],
    [/(\d*)B/, (m) => csi.cud = Number(m[1] || 1)],
    [/(\d*)C/, (m) => csi.cuf = Number(m[1] || 1)],
    [/(\d*)D/, (m) => csi.cub = Number(m[1] || 1)],
    [/(\d*)E/, (m) => csi.cnl = Number(m[1] || 1)],
    [/(\d*)F/, (m) => csi.cpl = Number(m[1] || 1)],
    [/(\d*)G/, (m) => csi.cha = Number(m[1] || 1)],
    [/(\d*);(\d*)H/, (m) => csi.cup = [Number(m[1] || 1), Number(m[2] || 1)]],
    [/(\d*)J/, (m) => csi.ed = Number(m[1] || 0)],
    [/(\d*)K/, (m) => csi.el = Number(m[1] || 0)],
    [/(\d*)S/, (m) => csi.su = Number(m[1] || 1)],
    [/(\d*)T/, (m) => csi.sd = Number(m[1] || 1)],
    [/(\d+);(\d+)f/, (m) => csi.hvp = [Number(m[1]), Number(m[2])]],
    [/([\d;]*)m/, (m) => csi.sgr = parseSgr(m[1])],
    [/6n/, () => csi.dsr = true],
    [/^.*/, () => {}],
  ];
  while (expr) {
    for (const [p, handler] of ps) {
      const m = expr.match(p);
      if (m) {
        handler(m);
        expr = expr.substring(m[0].length);
        break;
      }
    }
  }
  return csi;
}
