import * as pinInput from '@zag-js/pin-input'
import { normalizeProps, useMachine } from '@zag-js/react'

import { useMemo } from 'react'

export type PinInputApi = ReturnType<typeof usePinInputApi>

export const usePinInputApi = (id: string, nextFocusElementId: string) => {
  const [state, send] = useMachine(
    pinInput.machine({
      id,
      // blurOnComplete: true,
      placeholder: '',
      value: ['', '', '', ''],
      type: 'numeric',
      mask: true,
      // onComplete(_) {
      onValueComplete() {
        if (nextFocusElementId) {
          const nextFocusElement = document.getElementById(nextFocusElementId)
          if (!nextFocusElement) return

          setTimeout(() => {
            nextFocusElement.focus()
          }, 1)
        }
      },
    }),
  )

  return useMemo(() => {
    return pinInput.connect(state, send, normalizeProps)
  }, [send, state])
}
