import { describe, expect, test } from 'vitest'
import {
  MODS_REPO_URL,
  MOD_READ_ONLY,
  ModEntry,
  canAddMod,
  canEditMod,
  canRemoveMod,
  detectChanges,
  needsSync,
  useModsManager,
} from '../composables/useModsManager'

const makeMod = (overrides: Partial<ModEntry> = {}): ModEntry => ({
  id: 'test-mod',
  name: 'Test Mod',
  version: '1.0.0',
  filename: 'test-mod-1.0.0.jar',
  url: 'https://example.com/test-mod-1.0.0.jar',
  required: true,
  ...overrides,
})

describe('useModsManager', () => {
  describe('constants', () => {
    test('MOD_READ_ONLY is true', () => {
      expect(MOD_READ_ONLY).toBe(true)
    })

    test('MODS_REPO_URL points to M1xon0/modyclip', () => {
      expect(MODS_REPO_URL).toContain('M1xon0/modyclip')
    })
  })

  describe('read-only guards', () => {
    test('canAddMod returns false', () => {
      expect(canAddMod()).toBe(false)
    })

    test('canRemoveMod returns false', () => {
      expect(canRemoveMod()).toBe(false)
    })

    test('canEditMod returns false', () => {
      expect(canEditMod()).toBe(false)
    })
  })

  describe('detectChanges', () => {
    test('detects newly added mods', () => {
      const local: ModEntry[] = []
      const remote: ModEntry[] = [makeMod()]
      const result = detectChanges(local, remote)
      expect(result.added).toHaveLength(1)
      expect(result.added[0].id).toBe('test-mod')
      expect(result.removed).toHaveLength(0)
      expect(result.updated).toHaveLength(0)
    })

    test('detects removed mods', () => {
      const local: ModEntry[] = [makeMod()]
      const remote: ModEntry[] = []
      const result = detectChanges(local, remote)
      expect(result.removed).toHaveLength(1)
      expect(result.removed[0]).toBe('test-mod')
      expect(result.added).toHaveLength(0)
      expect(result.updated).toHaveLength(0)
    })

    test('detects updated mods (version change)', () => {
      const local: ModEntry[] = [makeMod({ version: '1.0.0' })]
      const remote: ModEntry[] = [makeMod({ version: '1.1.0', filename: 'test-mod-1.1.0.jar' })]
      const result = detectChanges(local, remote)
      expect(result.updated).toHaveLength(1)
      expect(result.updated[0].version).toBe('1.1.0')
      expect(result.added).toHaveLength(0)
      expect(result.removed).toHaveLength(0)
    })

    test('counts unchanged mods', () => {
      const mod = makeMod()
      const result = detectChanges([mod], [mod])
      expect(result.unchanged).toBe(1)
      expect(result.added).toHaveLength(0)
      expect(result.removed).toHaveLength(0)
      expect(result.updated).toHaveLength(0)
    })

    test('handles mixed changes correctly', () => {
      const local: ModEntry[] = [
        makeMod({ id: 'mod-a', version: '1.0.0' }),
        makeMod({ id: 'mod-b', version: '2.0.0' }),
        makeMod({ id: 'mod-c', version: '3.0.0' }),
      ]
      const remote: ModEntry[] = [
        makeMod({ id: 'mod-a', version: '1.0.0' }), // unchanged
        makeMod({ id: 'mod-b', version: '2.1.0' }), // updated
        makeMod({ id: 'mod-d', version: '4.0.0' }), // added
        // mod-c removed
      ]
      const result = detectChanges(local, remote)
      expect(result.unchanged).toBe(1)
      expect(result.updated).toHaveLength(1)
      expect(result.added).toHaveLength(1)
      expect(result.removed).toHaveLength(1)
    })

    test('returns all zeros for identical lists', () => {
      const mods = [makeMod({ id: 'a' }), makeMod({ id: 'b' })]
      const result = detectChanges(mods, mods)
      expect(result.added).toHaveLength(0)
      expect(result.removed).toHaveLength(0)
      expect(result.updated).toHaveLength(0)
      expect(result.unchanged).toBe(2)
    })
  })

  describe('needsSync', () => {
    test('returns true when there are added mods', () => {
      expect(needsSync({ added: [makeMod()], removed: [], updated: [], unchanged: 0 })).toBe(true)
    })

    test('returns true when there are removed mods', () => {
      expect(needsSync({ added: [], removed: ['mod-x'], updated: [], unchanged: 0 })).toBe(true)
    })

    test('returns true when there are updated mods', () => {
      expect(needsSync({ added: [], removed: [], updated: [makeMod()], unchanged: 5 })).toBe(true)
    })

    test('returns false when nothing changed', () => {
      expect(needsSync({ added: [], removed: [], updated: [], unchanged: 3 })).toBe(false)
    })
  })

  describe('useModsManager', () => {
    test('returns read-only true', () => {
      const manager = useModsManager()
      expect(manager.isReadOnly).toBe(true)
    })

    test('exposes repoUrl pointing to M1xon0/modyclip', () => {
      const manager = useModsManager()
      expect(manager.repoUrl).toContain('M1xon0/modyclip')
    })

    test('canAddMod returns false via manager', () => {
      const manager = useModsManager()
      expect(manager.canAddMod()).toBe(false)
    })

    test('canRemoveMod returns false via manager', () => {
      const manager = useModsManager()
      expect(manager.canRemoveMod()).toBe(false)
    })

    test('canEditMod returns false via manager', () => {
      const manager = useModsManager()
      expect(manager.canEditMod()).toBe(false)
    })

    test('detectChanges is accessible via manager', () => {
      const manager = useModsManager()
      const result = manager.detectChanges([], [makeMod()])
      expect(result.added).toHaveLength(1)
    })

    test('needsSync is accessible via manager', () => {
      const manager = useModsManager()
      const result = manager.detectChanges([], [makeMod()])
      expect(manager.needsSync(result)).toBe(true)
    })
  })
})
