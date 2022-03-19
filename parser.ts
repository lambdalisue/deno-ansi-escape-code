import { Csi, parseCsi, patternCsi } from "./csi.ts";

const patternCsiGlobal = new RegExp(patternCsi, "g");

export type Annotation = {
  offset: number;
  csi: Csi;
  raw: string;
};

/**
 * Trim and parse ANSI escape code in `expr` and return it.
 */
export function trimAndParse(expr: string): [string, Annotation[]] {
  const annotations = [...expr.matchAll(patternCsiGlobal)].map((m) => {
    return {
      offset: m.index ?? 0,
      csi: parseCsi(m[0]),
      raw: m[0],
    };
  });
  for (let i = annotations.length - 1; i >= 0; i--) {
    const n = annotations[i].raw.length;
    for (let j = i + 1; j < annotations.length; j++) {
      annotations[j].offset -= n;
    }
  }
  return [expr.replaceAll(patternCsiGlobal, ""), annotations];
}
