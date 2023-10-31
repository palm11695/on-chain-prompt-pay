interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

const Button = ({ children, variant, ...props }: ButtonProps) => {
  if (variant === 'secondary') {
    return (
      <button
        className="w-full rounded-xl bg-blue-200 py-3 font-semibold text-blue-600"
        {...props}
      >
        {children}
      </button>
    )
  }

  if (variant === 'danger') {
    return (
      <button
        className="w-full rounded-xl bg-red-50 py-3 font-semibold text-red-500"
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      className={`w-full rounded-xl ${
        props.disabled ? 'bg-blue-200' : 'bg-blue-600'
      } py-3 font-semibold text-white`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
