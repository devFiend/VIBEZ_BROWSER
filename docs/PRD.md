# Vibez Browser — Product Requirements Document (PRD)

**Document Status**: Final V1 & V2 Planning Specification  
**Version**: 1.0.0  
**Target Platform**: Windows 10/11 Desktop (Long-term: macOS, Linux)  
**License**: Apache-2.0  

---

## 1. Product Vision & Principles

### 1.1 Vision
Your browser should not just take you to the internet. It should help you get things done on it. Vibez Browser replaces tab chaos, intrusive advertisements, and browser clutter with a clean, focused, privacy-first workspace.

### 1.2 Core Principles
1. **Privacy is a Default, Not a Marketing Feature**: Tracker and ad blocking are enabled out-of-the-box. No hidden browsing telemetry, no cloud sync required for local features.
2. **Productivity Without Complexity**: Features like Workspaces and Split View reduce cognitive overhead rather than adding clutter.
3. **AI is Optional and Transparent**: In V2, AI assists with user-selected pages only upon explicit request. AI is never mandatory for core web navigation.
4. **User Ownership of Data**: History, bookmarks, workspace configs, and session states remain stored strictly on the local machine.
5. **Chromium Compatibility & Security**: Preserves multi-process site isolation, GPU acceleration, and web standard compliance.

---

## 2. Target Users & Problem Statements

| Target Audience | Primary Frustration | Vibez Solution |
| :--- | :--- | :--- |
| **Developers & Engineers** | 50+ open tabs, constant context switching between localhost, API docs, and PRs. | Dedicated Dev Workspaces, Split View (doc vs app), Command Center (`Ctrl+K`). |
| **Students & Researchers** | Fragmented source gathering, lost reference tabs across browser restarts. | Research Workspaces with Smart Sessions, side-by-side reading in Split View. |
| **Creators & Freelancers** | Mixing client logins, personal browsing, and client deliverables. | Separate Workspaces with isolated cookie and session containers. |
| **General Web Users** | Invasive trackers, popup clutter, battery-draining ad networks, privacy creep. | Hardware-efficient Privacy Shield with live blocked tracker counters. |

---

## 3. Product Requirements: V1 Core Release

### 3.1 Core Browser Shell
- **Engine**: Latest Chromium runtime with Blink rendering, V8 JavaScript, and Chromium networking.
- **Frameless Cyber-Glass Shell**: Custom Windows titlebar with minimize, maximize/restore, close buttons, and integrated tab strip.
- **Navigation (Omnibox)**: Unified address and search bar supporting instant URL resolution, DuckDuckGo/Google search, history search, and reload/stop controls.
- **Tab Management**: Create, close, duplicate, pin, reorder, mute/unmute audio, and drag tabs.
- **Browser Services**:
  - Bookmarks manager with folders and fast search.
  - Chronological browsing history with one-click purge and search.
  - Native download manager with real-time transfer progress, pause/resume, and folder reveal.
  - Error pages: Clean offline, DNS failure, and SSL warning pages.

### 3.2 V1 Signature Features

#### A. Privacy Shield
- **Tracker & Ad Blocking**: Pre-loaded EasyList and Disconnect blocking rules executed during `onBeforeRequest` request interception.
- **Per-Site Shield Drawer**: Clickable shield icon in the omnibox showing:
  - Shield status: ON/OFF toggle for current domain.
  - Real-time counter of blocked trackers and ads on current page.
  - HTTPS enforcement indicator.
- **Preset Protection Levels**:
  - *Balanced (Default)*: Blocks tracking scripts, fingerprinting domains, and intrusive ads without breaking legitimate websites.
  - *Strict*: Blocks all third-party scripts, referrers, and tracking cookies.
  - *Custom*: Granular control per category.

#### B. Workspaces
- Workspaces organize tabs into named environments (e.g., `⚡ Work`, `🔬 Research`, `🎮 Personal`, `💻 Dev`).
- Each workspace maintains its own isolated list of open tabs and active index.
- Switching workspaces immediately updates the tab strip and viewports with zero reload penalty.
- Visual workspace switcher on the left sidebar with custom color accents and icons.

#### C. Native Split View
- Display two live browser viewports side-by-side inside a single browser window.
- Independent navigation, URL bars, back/forward history, and DevTools for each pane.
- Draggable center divider allowing flexible 50/50, 70/30, or custom viewport ratios.
- Quick actions: Swap panes, close left/right pane, or expand to single view.

#### D. Command Center (`Ctrl+K`)
- Spotlight-style centered HUD accessible via `Ctrl+K` or search button.
- Instant fuzzy search across:
  - Open tabs across all workspaces (jump directly to any tab).
  - Bookmarks and history.
  - Built-in browser commands (e.g., `New Tab`, `Open Split View`, `Clear History`, `Toggle Shield`, `Switch Workspace`).
  - Web search query execution.

#### E. Smart Sessions
- Automatically persists active tabs, workspace assignments, and scroll coordinates locally.
- Restores tabs seamlessly upon browser restart.
- Manual session snapshots: Save named sessions (e.g., "Deep Research Session - React 19") to restore on demand.

### 3.3 Security & Privacy Requirements
- Multi-process architecture: Web pages run in isolated renderer processes with OS-level sandboxing.
- Strict Context Isolation: Web content has zero access to Node.js / host file system.
- Secure connection upgrade: Automatic HTTPS preference with visual warnings on insecure HTTP.
- Zero Telemetry: No browsing history, telemetry payloads, or usage stats transmitted to external servers.

### 3.4 Non-Goals for V1
- Mobile browser app (Android / iOS).
- Cloud-based account and cross-device sync (deferred to V2 with E2EE).
- Unrestricted AI web automation agents operating bank or shopping carts autonomously.
- Proprietary closed search engine.

---

## 4. V2 Roadmap (Future Expansion)

1. **AI Research Assistant**: Local/cloud hybrid LLM sidebar for summarizing active pages, comparing multiple sources across tabs, and generating cited research briefs.
2. **Browser Automations**: Local rule engine for user-defined triggers (e.g., "When opening GitHub, move to Dev workspace; when downloading PDF, save to Research folder").
3. **Encrypted Sync**: Zero-knowledge end-to-end encrypted peer-to-peer or server-assisted sync for bookmarks, settings, and workspaces.
4. **Smart Downloads 2.0**: Automatic MIME-type sorting, duplicate detection, and malware sandbox scans.
5. **Web Apps (PWA) Manager**: Install any website as an isolated desktop window.
