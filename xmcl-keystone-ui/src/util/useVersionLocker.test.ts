import { describe, expect, test } from 'vitest'
import {
  LOCKED_MINECRAFT_VERSION,
  LOCKED_MOD_LOADER,
  canLaunch,
  getLockedRuntime,
  isModLoaderLocked,
  isVersionLocked,
  validateInstance,
} from '../composables/useVersionLocker'

describe('useVersionLocker', () => {
  describe('constants', () => {
    test('locked Minecraft version is 1.21.1', () => {
      expect(LOCKED_MINECRAFT_VERSION).toBe('1.21.1')
    })

    test('locked mod loader is neoforge', () => {
      expect(LOCKED_MOD_LOADER).toBe('neoforge')
    })
  })

  describe('isVersionLocked', () => {
    test('returns true for the locked version', () => {
      expect(isVersionLocked('1.21.1')).toBe(true)
    })

    test('returns false for other versions', () => {
      expect(isVersionLocked('1.20.1')).toBe(false)
      expect(isVersionLocked('1.21.0')).toBe(false)
      expect(isVersionLocked('1.21.4')).toBe(false)
      expect(isVersionLocked('')).toBe(false)
    })
  })

  describe('isModLoaderLocked', () => {
    test('returns true for neoforge (case-insensitive)', () => {
      expect(isModLoaderLocked('neoforge')).toBe(true)
      expect(isModLoaderLocked('NeoForge')).toBe(true)
      expect(isModLoaderLocked('NEOFORGE')).toBe(true)
    })

    test('returns false for other loaders', () => {
      expect(isModLoaderLocked('forge')).toBe(false)
      expect(isModLoaderLocked('fabric')).toBe(false)
      expect(isModLoaderLocked('quilt')).toBe(false)
      expect(isModLoaderLocked('')).toBe(false)
    })
  })

  describe('canLaunch', () => {
    test('allows launch with correct version and NeoForge set', () => {
      expect(canLaunch({ minecraft: '1.21.1', neoForged: '21.1.100' })).toBe(true)
    })

    test('blocks launch when Minecraft version is wrong', () => {
      expect(canLaunch({ minecraft: '1.20.1', neoForged: '20.1.100' })).toBe(false)
      expect(canLaunch({ minecraft: '1.21.0', neoForged: '21.0.50' })).toBe(false)
    })

    test('blocks launch when NeoForge is not set', () => {
      expect(canLaunch({ minecraft: '1.21.1' })).toBe(false)
      expect(canLaunch({ minecraft: '1.21.1', neoForged: '' })).toBe(false)
    })

    test('blocks launch when both version and loader are wrong', () => {
      expect(canLaunch({ minecraft: '1.20.1' })).toBe(false)
    })
  })

  describe('validateInstance', () => {
    test('returns valid for correct 1.21.1 NeoForge runtime', () => {
      const result = validateInstance({ minecraft: '1.21.1', neoForged: '21.1.100' })
      expect(result.valid).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    test('returns invalid with reason when Minecraft version is wrong', () => {
      const result = validateInstance({ minecraft: '1.20.1', neoForged: '20.1.100' })
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('1.21.1')
      expect(result.reason).toContain('1.20.1')
    })

    test('returns invalid with reason when NeoForge is missing', () => {
      const result = validateInstance({ minecraft: '1.21.1' })
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('NeoForge')
    })

    test('prioritises Minecraft version error over missing NeoForge', () => {
      const result = validateInstance({ minecraft: '1.19.4' })
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('1.21.1')
    })
  })

  describe('getLockedRuntime', () => {
    test('returns runtime with locked Minecraft version', () => {
      const runtime = getLockedRuntime('21.1.100')
      expect(runtime.minecraft).toBe('1.21.1')
      expect(runtime.neoForged).toBe('21.1.100')
    })

    test('returns runtime without neoForged when no version provided', () => {
      const runtime = getLockedRuntime()
      expect(runtime.minecraft).toBe('1.21.1')
      expect(runtime.neoForged).toBeUndefined()
    })

    test('returns runtime without neoForged for empty string', () => {
      const runtime = getLockedRuntime('')
      expect(runtime.minecraft).toBe('1.21.1')
      expect(runtime.neoForged).toBeUndefined()
    })
  })
})
