import { assertEquals } from "https://deno.land/std@0.130.0/testing/asserts.ts";
import { Csi, parseCsi } from "./csi.ts";

Deno.test("parseCsi", async (t) => {
  const testcases: [string, Csi][] = [
    ["\x1b[10A", { cuu: 10 }],
    ["\x1b[B", { cud: 1 }],
    ["\x1b[1m", { sgr: { bold: true } }],
  ];
  for (const [expr, expected] of testcases) {
    await t.step(`properly handle "${expr}"`, () => {
      const actual = parseCsi(expr);
      assertEquals(actual, expected);
    });
  }
});
