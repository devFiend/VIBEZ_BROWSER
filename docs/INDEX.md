# Vibez Browser — Master Documentation Index

Welcome to the official technical documentation for **Vibez Browser**, a privacy-first, productivity-focused desktop browser built on the Chromium engine for Windows (with long-term macOS and Linux support).

---

## 🧭 Documentation Map

| Document | Description | Key Topics |
| :--- | :--- | :--- |
| **[PRD.md](file:///C:/Users/devFiend/Desktop/Web Dev Projects/VIBEZ_BROWSER/docs/PRD.md)** | Full Product Requirements Document | Vision, target audience, V1 & V2 requirements, non-goals, success metrics. |
| **[ARCHITECTURE.md](file:///C:/Users/devFiend/Desktop/Web Dev Projects/VIBEZ_BROWSER/docs/ARCHITECTURE.md)** | Technical Architecture & System Design | Chromium multi-process model, WebContentsView layering, IPC protocol, Privacy Shield filtering, Workspace state tree. |
| **[DEVELOPMENT_PHASES.md](file:///C:/Users/devFiend/Desktop/Web Dev Projects/VIBEZ_BROWSER/docs/DEVELOPMENT_PHASES.md)** | Implementation Roadmap (P0–P6) | Phased milestones, deliverables, verification gates, release criteria. |
| **[PRIVACY_AND_SECURITY.md](file:///C:/Users/devFiend/Desktop/Web Dev Projects/VIBEZ_BROWSER/docs/PRIVACY_AND_SECURITY.md)** | Privacy Guarantee & Threat Model | Ad/tracker blocking algorithms, zero-telemetry policy, cookie isolation, permission sandboxing. |
| **[KEYBOARD_SHORTCUTS.md](file:///C:/Users/devFiend/Desktop/Web Dev Projects/VIBEZ_BROWSER/docs/KEYBOARD_SHORTCUTS.md)** | Power User Command Reference | Command Center (`Ctrl+K`), Split View (`Ctrl+\`), Workspace switching (`Ctrl+1..9`), Tab navigation. |
| **[TESTING_STRATEGY.md](file:///C:/Users/devFiend/Desktop/Web Dev Projects/VIBEZ_BROWSER/docs/TESTING_STRATEGY.md)** | Quality Assurance & Testing Protocols | Unit tests, IPC fuzzing, ad-blocking benchmarks, session restore audits. |

---

## ⚡ Core Value Proposition

> **"Your browser should not just take you to the internet. It should help you get things done on it."**

Unlike traditional browsers that clutter the screen with news feeds, aggressive ad networks, and non-transparent background telemetry, Vibez Browser is engineered as an intentional productivity tool:
1. **Built-in Privacy Shield**: Hardware-accelerated ad and tracking protection enabled out-of-the-box with per-site controls.
2. **First-Class Workspaces**: Segregate research, coding, work, and personal browsing without context switching.
3. **Native Split View**: Compare documents, watch documentation alongside code, or research across two parallel viewports.
4. **Command Center (`Ctrl+K`)**: Rapid keyboard-driven navigation across tabs, history, bookmarks, and actions.
5. **Smart Sessions**: Instant session snapshotting and crash recovery preserving tab positions and workspace context.

---

## 🛠️ Technology Stack

- **Core Engine**: Chromium (Multi-process rendering, V8 JavaScript engine, Blink, sandboxed network stack).
- **Desktop Shell**: High-performance Node/Electron Chromium runtime with hardware-accelerated DirectComposition.
- **UI Framework**: Modern responsive Cyber-Glass design system (CSS3 variables, SVG icons, zero heavyweight frontend bloat).
- **Local Persistence**: Atomic JSON / SQLite structured storage for sessions, history, bookmarks, and shield rules.
- **Testing**: Jest / Mocha test harnesses with automated navigation and adblock assertion suites.
