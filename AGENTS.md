# Agent Instructions

# Regulatory

For regulatory questions:

1. Start with `docs/dlo/instrucoes-preenchimento/knowledge/index.md`.
2. Use files under `docs/dlo/instrucoes-preenchimento/knowledge` as the searchable representation of the specification.
3. Do not use `docs/dlo/instrucoes-preenchimento/generated/raw.md` as the primary source.
4. Do not use `docs/dlo/instrucoes-preenchimento/generated/normalized.md` as the primary source.
5. When correctness is uncertain, verify against `docs/dlo/instrucoes-preenchimento/source/original.pdf`.
6. The original PDF is the authoritative source.

## Authority hierarchy

```
source PDF > normalized Markdown > structured knowledge Markdown > derived YAML rules > implementation
```

If two layers disagree, walk up that hierarchy rather than deciding whichever representation is more convenient must be correct.

# Project

- Serverless.
- Client-side.

# User interface

- Using Mantine 9.5.1.
- Documentation: https://mantine.dev/llms.txt
