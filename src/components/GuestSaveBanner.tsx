import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { GUEST_STORY_LIFETIME_DAYS } from '@/lib/guestStories'
import type { GuestSaveBannerProps } from '@/types/auth'

const BANNER_HIDDEN_KEY = 'storyMixer:saveBannerHidden'

export function GuestSaveBanner({
  onLogin,
  onDismiss,
}: Readonly<GuestSaveBannerProps>) {
  return (
    <section
      aria-label="Saving tip"
      className="relative bg-storymixer-accent/45 dark:bg-storymixer-accent/20 text-sm"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 pr-12 sm:px-6 sm:pr-12 lg:px-8 lg:pr-12">
        <p>
          Stories are only saved in this browser and are removed after{' '}
          {GUEST_STORY_LIFETIME_DAYS} days.{' '}
          <button
            type="button"
            onClick={onLogin}
            className="underline text-storymixer-primary-dark dark:text-storymixer-accent hover:no-underline cursor-pointer"
          >
            Log in
          </button>{' '}
          to keep them safe.
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          <X />
        </Button>
      </div>
    </section>
  )
}

export function GuestNotice() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { status } = useAuth()
  const [isHidden, setIsHidden] = useState(true)

  useEffect(() => {
    setIsHidden(sessionStorage.getItem(BANNER_HIDDEN_KEY) === 'true')
  }, [])

  if (status !== 'guest' || isHidden) {
    return null
  }

  const handleDismiss = () => {
    sessionStorage.setItem(BANNER_HIDDEN_KEY, 'true')
    setIsHidden(true)
  }

  return (
    <GuestSaveBanner
      onLogin={() =>
        navigate({
          to: '/login',
          search: { mode: 'login', redirect: pathname },
        })
      }
      onDismiss={handleDismiss}
    />
  )
}
