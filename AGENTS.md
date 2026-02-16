# Repository Agent Rules

## Commit Guardrails

- This repository treats `.claude/` as version-controlled project configuration.
- Before every commit, check `.claude/` for modified/untracked files and include them in the same commit.
- Do not skip `.claude/` changes because of global ignore settings.
- If a `.claude/` file is ignored by global gitignore, stage it with `git add -f`.

## Commit Message

- Follow the commit format in `/Users/pitt.wu/Documents/personal/blog-docusaurus/CLAUDE.md`.
