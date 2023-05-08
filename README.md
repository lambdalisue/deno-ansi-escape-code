# ansi-escape-code

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/ansi_escape_code)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/ansi_escape_code/mod.ts)
[![Test](https://github.com/lambdalisue/deno-ansi-escape-code/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-ansi-escape-code/actions?query=workflow%3ATest)

Utilities to trim and parse ANSI escape sequence.

[deno]: https://deno.land/

## Usage

```typescript
import { assertEquals } from "https://deno.land/std@0.164.0/testing/asserts.ts";
import { trimAndParse } from "https://deno.land/x/ansi_escape_code/mod.ts";

const [trimmed, annotations] = trimAndParse(
  "\x1b[1mHe\x1b[30mll\x1b[31mo\x1b[m world",
);

assertEquals(trimmed, "Hello world");
assertEquals(annotations, [
  { offset: 0, raw: "\x1b[1m", csi: { sgr: { bold: true } } },
  { offset: 2, raw: "\x1b[30m", csi: { sgr: { foreground: 0 } } },
  { offset: 4, raw: "\x1b[31m", csi: { sgr: { foreground: 1 } } },
  { offset: 5, raw: "\x1b[m", csi: { sgr: { reset: true } } },
]);
```

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
