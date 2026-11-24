# Vibez Browser

A privacy-focused, productivity-oriented desktop web browser powered by the Chromium engine for Windows.

## Key Features

- **Privacy Shield**: Built-in request-level tracker and ad filtering with real-time statistics and per-site controls.
- **Workspaces**: Organize tabs into separated environments (e.g. Work, Research, Personal) with zero context leakage.
- **Native Split View**: Side-by-side viewports with an adjustable divider for cross-referencing and research.
- **Command Center (`Ctrl+K`)**: Keyboard-first search palette for tabs, bookmarks, history, and browser actions.
- **Smart Sessions**: Automatic session state persistence across browser restarts.
- **Local-First & Private**: Zero telemetry, no cloud account requirement, all data stored locally.

## Documentation

Full architectural and product documentation is available in the [`docs/`](./docs) directory:
- [INDEX.md](./docs/INDEX.md): Master documentation hub
- [PRD.md](./docs/PRD.md): Product requirements document
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md): Multi-process technical architecture
- [DEVELOPMENT_PHASES.md](./docs/DEVELOPMENT_PHASES.md): Phased implementation roadmap
- [PRIVACY_AND_SECURITY.md](./docs/PRIVACY_AND_SECURITY.md): Threat model and privacy guarantees
- [KEYBOARD_SHORTCUTS.md](./docs/KEYBOARD_SHORTCUTS.md): Power user command reference
- [TESTING_STRATEGY.md](./docs/TESTING_STRATEGY.md): Verification and test protocols

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Launch

```bash
npm install
npm start
```

### Running Tests

```bash
npm test
```
