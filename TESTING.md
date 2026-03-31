# Testing Documentation – ClipClient Launcher

## Overview

This document describes the testing strategy for the ClipClient launcher redesign.  
The launcher is restricted to **Minecraft 1.21.1 with NeoForge** – no other version or mod loader is allowed.  
Mods are **read-only** and synchronised automatically from [M1xon0/modyclip](https://github.com/M1xon0/modyclip).

---

## 1. Running Automated Tests

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)

### Install dependencies

```bash
pnpm install
```

### Run all tests

```bash
pnpm test
```

### Run specific test files

```bash
# Version locker unit tests
pnpm test xmcl-keystone-ui/src/util/useVersionLocker.test.ts

# Mods manager unit tests
pnpm test xmcl-keystone-ui/src/util/useModsManager.test.ts

# Game version utility tests (pre-existing)
pnpm test xmcl-keystone-ui/src/util/gameVersion.test.ts
```

---

## 2. Test Files

### Unit Tests (Vitest)

| File | Description |
|---|---|
| `xmcl-keystone-ui/src/util/useVersionLocker.test.ts` | Tests for the version lock composable |
| `xmcl-keystone-ui/src/util/useModsManager.test.ts` | Tests for the read-only mods manager composable |
| `xmcl-keystone-ui/src/util/gameVersion.test.ts` | Tests for game version selection utilities (pre-existing) |

### Source Files Under Test

| File | Description |
|---|---|
| `xmcl-keystone-ui/src/composables/useVersionLocker.ts` | Enforces Minecraft 1.21.1 + NeoForge |
| `xmcl-keystone-ui/src/composables/useModsManager.ts` | Read-only mods with auto-update from M1xon0/modyclip |
| `xmcl-keystone-ui/src/components/GamePanel.vue` | Right panel: Play, Mods, Discord buttons |
| `xmcl-keystone-ui/src/components/LoginScreen.vue` | Left panel: Microsoft / offline login |

---

## 3. useVersionLocker Tests

Tests are in `xmcl-keystone-ui/src/util/useVersionLocker.test.ts`.

### What is tested

| Test Group | Scenarios |
|---|---|
| **constants** | `LOCKED_MINECRAFT_VERSION === '1.21.1'`, `LOCKED_MOD_LOADER === 'neoforge'` |
| **isVersionLocked** | Returns `true` for `1.21.1`, `false` for `1.20.1`, `1.21.0`, `1.21.4`, etc. |
| **isModLoaderLocked** | Returns `true` for `neoforge` (case-insensitive), `false` for `forge`, `fabric`, `quilt` |
| **canLaunch** | `true` only when version is `1.21.1` AND `neoForged` is set; `false` otherwise |
| **validateInstance** | Returns `{ valid: true }` for correct config; `{ valid: false, reason }` with descriptive message for wrong version or missing NeoForge |
| **getLockedRuntime** | Returns runtime with `minecraft: '1.21.1'`; `neoForged` is set from argument or `undefined` |

---

## 4. useModsManager Tests

Tests are in `xmcl-keystone-ui/src/util/useModsManager.test.ts`.

### What is tested

| Test Group | Scenarios |
|---|---|
| **constants** | `MOD_READ_ONLY === true`, `MODS_REPO_URL` contains `M1xon0/modyclip` |
| **read-only guards** | `canAddMod()`, `canRemoveMod()`, `canEditMod()` all return `false` |
| **detectChanges** | Correctly identifies added, removed, updated, and unchanged mods |
| **needsSync** | Returns `true` when there are changes; `false` when everything is unchanged |
| **useModsManager()** | All properties and functions are accessible and behave as expected |

---

## 5. Manual / E2E Testing

See `TEST_CHECKLIST.md` for a comprehensive manual testing checklist.

Key scenarios to verify manually:

1. **Login flow** – Microsoft OAuth and offline login
2. **Version lock** – Game launches only with Minecraft 1.21.1 + NeoForge
3. **Mods display** – Mods are shown but cannot be edited/added/removed
4. **Mods auto-update** – Mods sync from M1xon0/modyclip repo
5. **Discord button** – Opens the Discord invite link
6. **Settings** – Java memory, resolution settings are accessible

---

## 6. Test Coverage Goals

| Layer | Target |
|---|---|
| Unit (composables) | ~80% |
| Integration (component flows) | Core features |
| E2E (manual checklist) | All user-visible features |
