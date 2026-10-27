import { LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/auth'
import type { AccountPanelProps } from '@/types/auth'

export function AccountPanel({
  user,
  onLogin,
  onLogout,
}: Readonly<AccountPanelProps>) {
  if (!user) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-storymixer-white/80">
          Log in to save your stories to an account.
        </p>
        <Button onClick={onLogin} variant="secondary" className="w-full h-11">
          <LogIn />
          Log in
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span
          aria-hidden="true"
          className="flex items-center justify-center size-11 shrink-0 rounded-full bg-storymixer-accent text-storymixer-primary-dark"
        >
          {getInitials(user.name)}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="truncate">{user.name}</span>
          <span className="truncate text-sm text-storymixer-white/75">
            {user.email}
          </span>
        </div>
      </div>
      <Button
        onClick={onLogout}
        variant="outline-inverse"
        className="w-full h-11"
      >
        <LogOut />
        Log out
      </Button>
    </div>
  )
}
