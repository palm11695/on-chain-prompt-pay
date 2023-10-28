import { PropsWithChildren } from 'react'

const Button = ({ children }: PropsWithChildren) => {
  return (
    <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white">
      {children}
    </button>
  )
}

export default Button
