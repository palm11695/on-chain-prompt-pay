import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}>

const Button = ({ children, variant }: Props) => {
  if (variant === 'secondary') {
    return (
      <button className="w-full rounded-xl bg-blue-200 py-3 font-semibold text-blue-600">
        {children}
      </button>
    )
  }

  return (
    <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white">
      {children}
    </button>
  )
}

export default Button
