# Manual Test Checklist – ClipClient Launcher

Use this checklist to manually verify the ClipClient launcher after each release.

---

## 1. Login

- [ ] **Microsoft login** – clicking the Microsoft login button opens the OAuth browser flow
- [ ] **Login succeeds** – after authentication the username and avatar are displayed
- [ ] **Offline login** – can create an offline account without internet access
- [ ] **Logout** – clicking logout removes the session and shows the login screen again
- [ ] **Token persistence** – closing and reopening the launcher keeps the user logged in

---

## 2. Home Screen Layout

- [ ] **Left panel (Login Screen)** – visible when not logged in; hidden when logged in
- [ ] **Right panel (Game Panel)** – visible at all times
- [ ] **Version chips** – `Minecraft 1.21.1` and `NeoForge` chips are displayed in the game panel
- [ ] **Responsive layout** – panels display correctly at 1280×720 and 1920×1080

---

## 3. GRAJ (Play) Button

- [ ] **Clicking GRAJ** starts the Minecraft launch sequence
- [ ] **Minecraft version** – the launched game reports version `1.21.1`
- [ ] **Mod loader** – NeoForge is loaded, not Forge/Fabric/Quilt
- [ ] **Wrong version blocked** – changing the instance runtime to `1.20.1` and clicking GRAJ should be blocked or show an error
- [ ] **Missing NeoForge blocked** – removing NeoForge from the instance runtime and clicking GRAJ should be blocked or show an error
- [ ] **Loading indicator** – the GRAJ button shows a spinner while the game is launching

---

## 4. Mods (Read-Only)

- [ ] **Mods list displayed** – the mods screen shows the current mods from M1xon0/modyclip
- [ ] **Cannot add mod** – there is no "Add mod" button, or it is disabled
- [ ] **Cannot remove mod** – there is no "Remove" button per mod, or it is disabled
- [ ] **Cannot edit mod** – mod settings/configuration cannot be changed
- [ ] **Auto-update** – when a new mod version is available in M1xon0/modyclip, it is downloaded automatically on next launch

---

## 5. Discord Button

- [ ] **Clicking Discord** opens the browser with the Discord invite link
- [ ] **Link is correct** – the URL is a valid Discord invite (`discord.gg/…`)

---

## 6. Settings

- [ ] **Java settings** – Java memory (min/max heap) can be configured
- [ ] **Resolution settings** – window width/height can be changed
- [ ] **Minecraft version field** – the version field is read-only / locked to `1.21.1`
- [ ] **Mod loader field** – the mod loader field is read-only / locked to NeoForge

---

## 7. Version Lock Verification

> Attempt to change the instance version and verify that the lock is enforced.

- [ ] Open instance settings → Versions tab
- [ ] Attempt to change Minecraft version to `1.20.1` → should be blocked (field is disabled or shows warning)
- [ ] Attempt to change mod loader to Fabric → should be blocked (field is disabled or shows warning)
- [ ] Attempt to remove NeoForge → should be blocked or auto-restored on save

---

## Results

| # | Scenario | Result | Notes |
|---|---|---|---|
| 1 | Microsoft login | ☐ Pass / ☐ Fail | |
| 2 | Offline login | ☐ Pass / ☐ Fail | |
| 3 | GRAJ launches 1.21.1 NeoForge | ☐ Pass / ☐ Fail | |
| 4 | Wrong version blocked | ☐ Pass / ☐ Fail | |
| 5 | Mods displayed | ☐ Pass / ☐ Fail | |
| 6 | Mods are read-only | ☐ Pass / ☐ Fail | |
| 7 | Mods auto-update | ☐ Pass / ☐ Fail | |
| 8 | Discord button | ☐ Pass / ☐ Fail | |
| 9 | Settings accessible | ☐ Pass / ☐ Fail | |
| 10 | Version lock enforced | ☐ Pass / ☐ Fail | |
