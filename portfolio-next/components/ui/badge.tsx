import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('px-2 py-1 rounded-full border border-muted/40 bg-surface/60 text-sm', className)} {...props} />;
}