import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { SpinnerProps } from '@/types/ui'

const sizeClasses = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
}

function Spinner({ size = 'md', className, ...props }: Readonly<SpinnerProps>) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin text-storymixer-primary',
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}

export { Spinner }
