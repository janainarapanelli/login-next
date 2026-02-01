import { NextResponse } from 'next/server'

export async function fetchUsers() {
  const res = await fetch('/api/users')
  return res.json()
}
