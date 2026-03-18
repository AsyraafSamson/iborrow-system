export async function logoutUser(push: (href: string) => void) {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    localStorage.removeItem('user')
    localStorage.removeItem('session_token')
    push('/login')
  }
}
