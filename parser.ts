import { type Csi, parseCsi, patternCsi } from "./csi.ts";

const patternCsiGlobal = new RegExp(patternCsi, "g");

export type Annotation = {
  offset: number;
  raw: string;
  csi: Csi;
};

export type AnnotationText = {
  offset: number;
  text: string;
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

/**
 * Parse ANSI escape code in `expr` and return it.
 * The function keeps both text output and annotations in the result.
 */
export function parseWithText(expr: string): (Annotation | AnnotationText)[] {
  const annotations: (Annotation | AnnotationText)[] = [];
  let currentOffset = 0;
  let adjustedOffset = 0;

  for (const match of expr.matchAll(patternCsiGlobal)) {
    const matchStart = match.index ?? 0;
    const matchEnd = matchStart + (match[0]?.length ?? 0);

    // Add the plain text before the match as a text annotation
    if (currentOffset < matchStart) {
      const textPart = expr.slice(currentOffset, matchStart);
      annotations.push({
        offset: adjustedOffset,
        text: textPart,
      });
      adjustedOffset += textPart.length; // Add text length
    }

    // Add the matched ANSI escape sequence
    annotations.push({
      offset: adjustedOffset,
      csi: parseCsi(match[0]!),
      raw: match[0]!,
    });

    currentOffset = matchEnd;
  }

  // Add the remaining text after the last match as a text annotation
  if (currentOffset < expr.length) {
    const textPart = expr.slice(currentOffset);
    annotations.push({
      offset: adjustedOffset,
      text: textPart,
    });
  }

  return annotations;
}
