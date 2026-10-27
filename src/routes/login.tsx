import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginForm } from '@/components/LoginForm'
import type { LoginFormValues, LoginMode } from '@/types/auth'
import { signIn } from '@/lib/auth'

export const Route = createFileRoute('/login')({
  validateSearch: (search): { mode: LoginMode; redirect?: string } => ({
    mode: z.enum(['login', 'signup']).catch('login').parse(search.mode),
    redirect: z
      .string()
      .regex(/^\/(?!\/)/)
      .optional()
      .catch(undefined)
      .parse(search.redirect),
  }),
  component: LoginComponent,
})

function LoginComponent() {
  const { mode, redirect } = Route.useSearch()
  const navigate = useNavigate()

  const handleModeChange = (nextMode: LoginMode) => {
    navigate({
      to: '/login',
      search: { mode: nextMode, redirect },
      replace: true,
    })
  }

  const handleSubmit = (values: LoginFormValues) => {
    signIn({
      name: values.name.trim() || values.email.split('@')[0],
      email: values.email,
    })
    navigate({ href: redirect ?? '/' })
  }

  return (
    <div className="pt-6">
      <LoginForm
        mode={mode}
        onModeChange={handleModeChange}
        onSubmit={handleSubmit}
        onContinueAsGuest={() => navigate({ href: redirect ?? '/' })}
      />
    </div>
  )
}
