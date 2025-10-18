import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'ghost'|'primary' };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button({ className, variant='default', ...props }, ref) {
  const base = 'inline-flex items-center gap-2 rounded-full border border-muted/40 px-4 py-2 font-semibold transition-transform';
  const styles = variant === 'primary'
    ? 'text-black bg-[color-mix(in_oklab,_white,_var(--tw-color-accent)_20%)] shadow-soft'
    : variant === 'ghost'
      ? 'text-text bg-surface/60'
      : 'bg-surface/70';
  return <button ref={ref} className={cn(base, styles, className)} {...props} />;
});