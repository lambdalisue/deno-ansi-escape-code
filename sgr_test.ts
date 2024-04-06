import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { parseSgr, type Sgr } from "./sgr.ts";

Deno.test("parseSgr", async (t) => {
  const testcases: [string, Sgr][] = [
    ["", { reset: true }],
    ["1", { bold: true }],
    ["1;2;3", { bold: true, dim: true, italic: true }],
    ["1;31", { bold: true, foreground: 1 }],
    ["30;47", { foreground: 0, background: 7 }],
    ["90;107", { foreground: 8, background: 15 }],
    ["38;5;255;48;5;232", { foreground: 255, background: 232 }],
    ["38;5;;48;5;", { foreground: 0, background: 0 }],
    ["38;2;255;255;255;48;2;0;0;0", {
      foreground: [255, 255, 255],
      background: [0, 0, 0],
    }],
    ["38;2;;;;48;2;;;", {
      foreground: [0, 0, 0],
      background: [0, 0, 0],
    }],
    ["39;49", { foreground: "default", background: "default" }],
    // Fraktur (Gothic) that rarely supported (and parseSgr does not support as well)
    ["20", {}],
  ];
  for (const [expr, expected] of testcases) {
    await t.step(`properly handle "${expr}"`, () => {
      const actual = parseSgr(expr);
      assertEquals(actual, expected);
    });
  }
});
