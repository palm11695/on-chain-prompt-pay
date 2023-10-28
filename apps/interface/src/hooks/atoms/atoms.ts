import { atomWithStorage } from 'jotai/utils'
import { parseStorageKey } from '../../utils/storage'

export const aaAccountAtom = atomWithStorage(
  parseStorageKey('aa_account'),
  {} as Record<string, string>,
)
