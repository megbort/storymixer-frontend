export interface AuthUser {
  name: string
  email: string
}

export type AuthState =
  { status: 'guest'; user: null } | { status: 'signedIn'; user: AuthUser }

export type LoginMode = 'login' | 'signup'

export interface LoginFormValues {
  name: string
  email: string
  password: string
}

export interface LoginFormProps {
  mode: LoginMode
  onModeChange: (mode: LoginMode) => void
  onSubmit: (values: LoginFormValues) => void
  onContinueAsGuest: () => void
  error?: string | null
  isLoading?: boolean
}

export interface AccountPanelProps {
  user: AuthUser | null
  onLogin: () => void
  onLogout: () => void
}

export interface GuestSaveBannerProps {
  onLogin: () => void
  onDismiss: () => void
}
