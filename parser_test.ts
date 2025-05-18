import { assertEquals } from "jsr:@std/assert@1.0.2/equals";
import {
  type Annotation,
  type AnnotationText,
  parseWithText,
  trimAndParse,
} from "./parser.ts";

Deno.test("trimAndParse", async (t) => {
  const testcases: [string, [string, Annotation[]]][] = [
    ["Hello world", ["Hello world", []]],
    ["\x1b[1mHello\x1b[m world", ["Hello world", [
      { offset: 0, raw: "\x1b[1m", csi: { sgr: { bold: true } } },
      { offset: 5, raw: "\x1b[m", csi: { sgr: { reset: true } } },
    ]]],
    ["\x1b[1mHe\x1b[30mll\x1b[31mo\x1b[m world", ["Hello world", [
      { offset: 0, raw: "\x1b[1m", csi: { sgr: { bold: true } } },
      { offset: 2, raw: "\x1b[30m", csi: { sgr: { foreground: 0 } } },
      { offset: 4, raw: "\x1b[31m", csi: { sgr: { foreground: 1 } } },
      { offset: 5, raw: "\x1b[m", csi: { sgr: { reset: true } } },
    ]]],
    ["\x1b[31mRed\x1b[m", [
      "Red",
      [
        { offset: 0, raw: "\x1b[31m", csi: { sgr: { foreground: 1 } } },
        { offset: 3, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ]],
    ["\x1b[1;31mBright red (old)\x1b[m", [
      "Bright red (old)",
      [
        {
          offset: 0,
          raw: "\x1b[1;31m",
          csi: { sgr: { bold: true, foreground: 1 } },
        },
        { offset: 16, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ]],
    ["\x1b[91mBright red (new)\x1b[m", [
      "Bright red (new)",
      [
        { offset: 0, raw: "\x1b[91m", csi: { sgr: { foreground: 9 } } },
        { offset: 16, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ]],
    ["\x1b[32m|\x1b[m\x1b[33m\\\x1b[m", [
      "|\\",
      [
        { offset: 0, raw: "\x1b[32m", csi: { sgr: { foreground: 2 } } },
        { offset: 1, raw: "\x1b[m", csi: { sgr: { reset: true } } },
        { offset: 1, raw: "\x1b[33m", csi: { sgr: { foreground: 3 } } },
        { offset: 2, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ]],
  ];
  for (const [expr, expected] of testcases) {
    await t.step(`properly handle "${expr}"`, () => {
      const actual = trimAndParse(expr);
      assertEquals(actual, expected);
    });
  }
});

Deno.test("trimAndParse", async (t) => {
  const testcases: [string, [string, Annotation[]]][] = [
    ["Hello world", ["Hello world", []]],
    ["\x1b[1mHello\x1b[m world", ["Hello world", [
      { offset: 0, raw: "\x1b[1m", csi: { sgr: { bold: true } } },
      { offset: 5, raw: "\x1b[m", csi: { sgr: { reset: true } } },
    ]]],
    ["\x1b[1mHe\x1b[30mll\x1b[31mo\x1b[m world", ["Hello world", [
      { offset: 0, raw: "\x1b[1m", csi: { sgr: { bold: true } } },
      { offset: 2, raw: "\x1b[30m", csi: { sgr: { foreground: 0 } } },
      { offset: 4, raw: "\x1b[31m", csi: { sgr: { foreground: 1 } } },
      { offset: 5, raw: "\x1b[m", csi: { sgr: { reset: true } } },
    ]]],
    ["\x1b[31mRed\x1b[m", [
      "Red",
      [
        { offset: 0, raw: "\x1b[31m", csi: { sgr: { foreground: 1 } } },
        { offset: 3, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ]],
    ["\x1b[1;31mBright red (old)\x1b[m", [
      "Bright red (old)",
      [
        {
          offset: 0,
          raw: "\x1b[1;31m",
          csi: { sgr: { bold: true, foreground: 1 } },
        },
        { offset: 16, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ]],
    ["\x1b[91mBright red (new)\x1b[m", [
      "Bright red (new)",
      [
        { offset: 0, raw: "\x1b[91m", csi: { sgr: { foreground: 9 } } },
        { offset: 16, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ]],
    ["\x1b[32m|\x1b[m\x1b[33m\\\x1b[m", [
      "|\\",
      [
        { offset: 0, raw: "\x1b[32m", csi: { sgr: { foreground: 2 } } },
        { offset: 1, raw: "\x1b[m", csi: { sgr: { reset: true } } },
        { offset: 1, raw: "\x1b[33m", csi: { sgr: { foreground: 3 } } },
        { offset: 2, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ]],
  ];
  for (const [expr, expected] of testcases) {
    await t.step(`properly handle "${expr}"`, () => {
      const actual = trimAndParse(expr);
      assertEquals(actual, expected);
    });
  }
});

Deno.test("parseWithText", async (t) => {
  const testcases: [string, (Annotation | AnnotationText)[]][] = [
    [
      "Hello world",
      [{ offset: 0, text: "Hello world" }],
    ],
    [
      "\x1b[1mHello\x1b[m world",
      [
        { offset: 0, raw: "\x1b[1m", csi: { sgr: { bold: true } } },
        { offset: 0, text: "Hello" },
        { offset: 5, raw: "\x1b[m", csi: { sgr: { reset: true } } },
        { offset: 5, text: " world" },
      ],
    ],
    [
      "\x1b[1mHe\x1b[30mll\x1b[31mo\x1b[m world",
      [
        { offset: 0, raw: "\x1b[1m", csi: { sgr: { bold: true } } },
        { offset: 0, text: "He" },
        { offset: 2, raw: "\x1b[30m", csi: { sgr: { foreground: 0 } } },
        { offset: 2, text: "ll" },
        { offset: 4, raw: "\x1b[31m", csi: { sgr: { foreground: 1 } } },
        { offset: 4, text: "o" },
        { offset: 5, raw: "\x1b[m", csi: { sgr: { reset: true } } },
        { offset: 5, text: " world" },
      ],
    ],
    [
      "\x1b[31mRed\x1b[m",
      [
        { offset: 0, raw: "\x1b[31m", csi: { sgr: { foreground: 1 } } },
        { offset: 0, text: "Red" },
        { offset: 3, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ],
    [
      "\x1b[1;31mBright red (old)\x1b[m",
      [
        {
          offset: 0,
          raw: "\x1b[1;31m",
          csi: { sgr: { bold: true, foreground: 1 } },
        },
        { offset: 0, text: "Bright red (old)" },
        { offset: 16, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ],
    [
      "\x1b[91mBright red (new)\x1b[m",
      [
        { offset: 0, raw: "\x1b[91m", csi: { sgr: { foreground: 9 } } },
        { offset: 0, text: "Bright red (new)" },
        { offset: 16, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ],
    [
      "\x1b[32m|\x1b[m\x1b[33m\\\x1b[m",
      [
        { offset: 0, raw: "\x1b[32m", csi: { sgr: { foreground: 2 } } },
        { offset: 0, text: "|" },
        { offset: 1, raw: "\x1b[m", csi: { sgr: { reset: true } } },
        { offset: 1, raw: "\x1b[33m", csi: { sgr: { foreground: 3 } } },
        { offset: 1, text: "\\" },
        { offset: 2, raw: "\x1b[m", csi: { sgr: { reset: true } } },
      ],
    ],
  ];

  for (const [expr, expected] of testcases) {
    await t.step(`properly handle "${expr}"`, () => {
      const actual = parseWithText(expr);
      assertEquals(actual, expected);
    });
  }
});
