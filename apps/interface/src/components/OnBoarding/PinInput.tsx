import { useMemo } from 'react'
import { PinInputApi } from '../../hooks/usePinInputApi'

export function PinInput({
  api,
  size,
  isMobile,
  isError,
}: {
  api: PinInputApi
  size: 'sm' | 'xl'
  isMobile?: boolean
  isError?: boolean // currently only available on mobile
}) {
  const inputClasses = useMemo(() => {
    let base
    if (size === 'sm') {
      base =
        'rounded bg-gray-100 text-white-0 text-center w-10 h-10 outline-yellow-1'
    } else {
      base =
        'rounded bg-gray-100 text-white-0 text-center w-14 h-14 outline-yellow-1'
    }
    const error =
      'border border-red-support shadow-[0_0_4px_0] shadow-red-support'
    return isError ? [base, error].join(' ') : base
  }, [size, isMobile, isError])

  const { rootProps, inputsProps } = useMemo(() => {
    return {
      rootProps: api.rootProps,
      inputsProps: [
        api.getInputProps({ index: 0 }),
        api.getInputProps({ index: 1 }),
        api.getInputProps({ index: 2 }),
        api.getInputProps({ index: 3 }),
      ],
    }
  }, [api])

  return (
    <div
      className={`flex w-full flex-row ${size === 'xl' ? 'gap-4' : 'gap-2'}`}
      {...rootProps}
    >
      <input className={inputClasses} maxLength={1} {...inputsProps[0]} />
      <input className={inputClasses} maxLength={1} {...inputsProps[1]} />
      <input className={inputClasses} maxLength={1} {...inputsProps[2]} />
      <input className={inputClasses} maxLength={1} {...inputsProps[3]} />
    </div>
  )
}
