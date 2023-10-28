interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

const Button = ({ children, ...props }: ButtonProps) => {
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
