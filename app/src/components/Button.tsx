import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'default' | 'small';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', fullWidth = false, className = '', disabled, children, ...props }, ref) => {
    const base = [
      'inline-flex items-center justify-center font-semibold',
      'transition-colors duration-[150ms] ease-out',
      'focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    ].join(' ')

    const sizes: Record<string, string> = {
      default: 'h-10 px-4 text-[15px]',
      small:   'h-8 px-3 text-[13px]',
    }

    const variants: Record<string, string> = {
      primary: [
        'bg-[var(--ink)] text-white border border-[var(--ink)]',
        'hover:bg-[#3a3835] active:bg-[#2a2825]',
        'shadow-[var(--shadow-sm)] rounded-[8px]',
      ].join(' '),
      secondary: [
        'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]',
        'hover:border-[var(--text-muted)] hover:shadow-[var(--shadow-sm)]',
        'active:bg-[var(--panel)] rounded-[8px]',
      ].join(' '),
      text: [
        'text-[var(--accent)] underline underline-offset-2 decoration-[var(--accent)]/40',
        'hover:text-[var(--ink)] hover:decoration-[var(--ink)]/40',
        'bg-transparent border-none px-0 h-auto shadow-none',
      ].join(' '),
      danger: [
        'bg-[var(--wrong)] text-white border border-[var(--wrong)]',
        'hover:bg-[#a82020] active:bg-[#911b1b]',
        'shadow-[var(--shadow-sm)] rounded-[8px]',
      ].join(' '),
    }

    return (
      <button
        ref={ref}
        className={[base, sizes[size], variants[variant], fullWidth ? 'w-full' : '', className].join(' ')}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'