import { useState } from 'react'
import { z } from 'zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { LoginFormProps, LoginFormValues, LoginMode } from '@/types/auth'

const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter your name')
    .max(100, 'Name must be 100 characters or fewer'),
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const COPY = {
  login: {
    heading: 'Welcome back',
    subheading: 'Log in to keep your stories in one place.',
    submit: 'Log in',
    loading: 'Logging in…',
  },
  signup: {
    heading: 'Create your account',
    subheading: 'Save your stories and come back to them anytime.',
    submit: 'Create account',
    loading: 'Creating account…',
  },
} as const

export function LoginForm({
  mode,
  onModeChange,
  onSubmit,
  onContinueAsGuest,
  error,
  isLoading = false,
}: Readonly<LoginFormProps>) {
  const [values, setValues] = useState<LoginFormValues>({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<LoginFormValues>>({})
  const [showPassword, setShowPassword] = useState(false)

  const isSignup = mode === 'signup'
  const copy = COPY[mode]

  const handleChange = (field: keyof LoginFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleModeChange = (nextMode: LoginMode) => {
    setErrors({})
    onModeChange(nextMode)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const result = (isSignup ? signupSchema : loginSchema).safeParse(values)
    if (!result.success) {
      const newErrors: Partial<LoginFormValues> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormValues
        newErrors[field] ??= issue.message
      })
      setErrors(newErrors)
      return
    }

    onSubmit(values)
  }

  return (
    <div className="w-full max-w-110 mx-auto rounded-2xl border border-border dark:border-storymixer-grey-dark bg-card text-card-foreground shadow-lg dark:shadow-card-dark p-6 sm:p-8 flex flex-col gap-5">
      <div className="flex gap-1 p-1 rounded-lg bg-storymixer-primary/10 dark:bg-storymixer-primary-light/15">
        {(['login', 'signup'] as const).map((tabMode) => (
          <button
            key={tabMode}
            type="button"
            onClick={() => handleModeChange(tabMode)}
            aria-pressed={mode === tabMode}
            className={cn(
              'flex-1 h-10 rounded-md text-sm transition-colors cursor-pointer',
              mode === tabMode
                ? 'bg-card text-foreground shadow-sm'
                : 'text-foreground/70 hover:text-foreground',
            )}
          >
            {tabMode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl">{copy.heading}</h1>
        <p className="text-sm text-foreground/70">{copy.subheading}</p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex gap-2.5 items-start rounded-lg px-3.5 py-3 text-sm bg-storymixer-error/10 text-storymixer-error-alt dark:text-storymixer-error"
        >
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {isSignup && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="What should we call you?"
              value={values.name}
              onChange={(event) => handleChange('name', event.target.value)}
              aria-invalid={!!errors.name}
              className="h-11"
            />
            {errors.name && (
              <p className="text-storymixer-error text-sm">{errors.name}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(event) => handleChange('email', event.target.value)}
            aria-invalid={!!errors.email || !!error}
            className="h-11"
          />
          {errors.email && (
            <p className="text-storymixer-error text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-controls="password"
              aria-pressed={showPassword}
              className="text-sm text-storymixer-primary dark:text-storymixer-primary-light hover:underline cursor-pointer"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            placeholder={isSignup ? 'Choose a password' : 'Your password'}
            value={values.password}
            onChange={(event) => handleChange('password', event.target.value)}
            aria-invalid={!!errors.password || (!!error && !isSignup)}
            className="h-11"
          />
          {errors.password ? (
            <p className="text-storymixer-error text-sm">{errors.password}</p>
          ) : (
            isSignup && (
              <p className="text-sm text-foreground/70">
                At least 8 characters.
              </p>
            )
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          {isLoading ? copy.loading : copy.submit}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-foreground/70">
        <span className="flex-1 h-px bg-border dark:bg-storymixer-grey-dark" />
        or
        <span className="flex-1 h-px bg-border dark:bg-storymixer-grey-dark" />
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <Button variant="link" onClick={onContinueAsGuest}>
          Keep mixing as a guest
        </Button>
        <p className="text-xs text-foreground/70">
          Guest stories stay saved in this browser.
        </p>
      </div>
    </div>
  )
}
