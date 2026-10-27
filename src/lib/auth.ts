import { useSyncExternalStore } from 'react'
import type { AuthState, AuthUser } from '@/types/auth'

const GUEST: AuthState = { status: 'guest', user: null }

let state: AuthState = GUEST
const listeners = new Set<() => void>()

function setState(next: AuthState) {
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function signIn(user: AuthUser) {
  setState({ status: 'signedIn', user })
}

export function signOut() {
  setState(GUEST)
}

export function useAuth() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => GUEST,
  )
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}
