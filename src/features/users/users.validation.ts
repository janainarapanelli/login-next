export function validateUser(data: any) {
  const errors: Record<string, string> = {}
  if (!data.email) errors.email = 'Email obrigatório'
  return { valid: Object.keys(errors).length === 0, errors }
}
