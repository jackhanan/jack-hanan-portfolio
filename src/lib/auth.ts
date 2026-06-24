export function getExpectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? ''
  return Buffer.from(password).toString('base64')
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false
  return token === getExpectedToken()
}
