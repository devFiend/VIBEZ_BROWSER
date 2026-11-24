# Vibez Browser — Privacy & Security Specification

Privacy is the foundational tenet of Vibez Browser. The browser is designed from the ground up with zero hidden telemetry, strict multi-process sandboxing, and out-of-the-box ad and tracking protection.

---

## 1. Zero-Telemetry Commitment

1. **No Browsing History Transmission**: Your URLs, search queries, page contents, and visit timestamps never leave your device.
2. **No User Profiling or Advertising ID**: Vibez Browser does not generate or assign persistent machine IDs, behavioral profiles, or device fingerprint beacons.
3. **No Automatic Account Requirements**: Browsing, workspaces, bookmarks, and privacy shields operate 100% locally without creating an account or logging in.
4. **Transparent Crash Logs**: Crash reporting is strictly opt-in, stored locally, and stripped of personal data before review.

---

## 2. Privacy Shield Architecture

The **Privacy Shield** is a native, hardware-efficient filtering layer that inspects all outgoing web requests:

```
[Web Page Request] ---> [Privacy Shield Filter] ---> Allowed? ---> [Internet]
                              |
                              +---> Blocked? ---> [Drop / 1x1 Transparent SVG]
                              |
                              +---> Increment Page Block Counter
```

### 2.1 Blocklist Sources
- **EasyList & EasyPrivacy**: Comprehensive community-vetted ad and tracker rules.
- **Disconnect Tracking Protection**: Categorized lists of analytics, social, and advertising trackers.
- **Crypto-Mining & Malware Domains**: High-risk domain lists to protect system resources.

### 2.2 Protection Tiers

| Tier | Tracking Scripts | Invasive Ads | Third-Party Cookies | Referrer Stripping |
| :--- | :---: | :---: | :---: | :---: |
| **Balanced (Default)** | Blocked | Blocked | Blocked | Truncated to origin |
| **Strict** | Blocked | Blocked | Blocked | Completely Removed |
| **Off (Per-Site)** | Allowed | Allowed | Allowed | Standard |

---

## 3. Sandboxing & Process Isolation

- **OS-Level Sandboxing**: Web pages execute inside Chromium's restricted process sandbox, preventing untrusted JavaScript from accessing the Windows filesystem, memory, or devices.
- **Context Isolation**: Web pages have zero access to Node.js APIs or electron internal bindings.
- **Secure Preload Channel**: Communication between browser chrome and native host occurs strictly via typed, validated IPC channels.
- **Permission Firewall**: Camera, microphone, geolocation, and notification requests trigger an explicit user prompt with per-origin remembered choices.
