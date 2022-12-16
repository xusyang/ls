import { assert, it, expect, describe } from 'vitest'
import { parseArgs } from '../src/parseArg'

describe('parseArgs', () => {
  it('tu-ls -a', () => {
    const args = parseArgs(['-a'])
    assert.deepEqual(args, { isAll: true, isList: false })
  })

  it('tu-ls -l', () => {
    const args = parseArgs(['-l'])
    assert.deepEqual(args, { isAll: false, isList: true })
  })

  it('tu-ls -l -a', () => {
    const args = parseArgs(['-l', '-a'])
    assert.deepEqual(args, { isAll: true, isList: true })
  })

  it('tu-ls -a -l', () => {
    const args = parseArgs(['-a', '-l'])
    assert.deepEqual(args, { isAll: true, isList: true })
  })

  it('tu-ls -al', () => {
    const args = parseArgs(['-al'])
    assert.deepEqual(args, { isAll: true, isList: true })
  })

  it('tu-ls -la', () => {
    const args = parseArgs(['-la'])
    assert.deepEqual(args, { isAll: true, isList: true })
  })
})
