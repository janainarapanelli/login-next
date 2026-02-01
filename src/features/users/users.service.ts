export async function getUsers() {
  return []
}

export async function createUser(payload: any) {
  return { id: 'u1', ...payload }
}
