export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export default function Button({ label, ...props }: ButtonProps) {
  return <button {...props}>{label ?? 'Button'}</button>
}
