import { atomWithStorage } from 'jotai/utils'
import { parseStorageKey } from '../../utils/storage'

export const aaSignerAtom = atomWithStorage(
  parseStorageKey('aa_signer'),
  {} as Record<string, string>,
)

export const aaSignedLocallyAtom = atomWithStorage(
  parseStorageKey('aa_siged_locally'),
  {} as Record<string, boolean>,
)
