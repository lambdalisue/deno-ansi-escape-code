# ansi-escape-code

[![jsr](https://img.shields.io/jsr/v/%40lambdalisue/ansi-escape-code?logo=javascript&logoColor=white)](https://jsr.io/@lambdalisue/ansi-escape-code)
[![denoland](https://img.shields.io/github/v/release/lambdalisue/deno-ansi-escape-code?logo=deno&label=denoland)](https://github.com/lambdalisue/deno-ansi-escape-code/releases)
[![deno doc](https://doc.deno.land/badge.svg)](https://jsr.io/@lambdalisue/ansi-escape-code/doc)
[![Test](https://github.com/lambdalisue/deno-ansi-escape-code/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-ansi-escape-code/actions?query=workflow%3ATest)

Utilities to trim and parse ANSI escape sequence.

[Deno]: https://deno.land/

## Usage

```typescript
import { assertEquals } from "jsr:@std/assert@1.0.2/equals";
import { trimAndParse } from "jsr:@lambdalisue/ansi-escape-code";

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
