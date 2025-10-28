import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

function readPrivateKey(): string {
  const key = process.env.PRIVATE_KEY
  if (!key) {
    throw new Error('Missing PRIVATE_KEY in .env')
  }
  return key
}

export async function hashPassword(plain: string): Promise<string> {
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12)
  return bcrypt.hash(plain, rounds)
}

export function signToken(claims: Record<string, any>): string {
  const privateKey = readPrivateKey()
  const alg = process.env.ALGORITHM ?? 'ES256'
  const exp = process.env.EXPIRATION ?? '3600'
  const aud = process.env.AUD ?? 'csci32-frontend'
  const iss = process.env.ISS ?? 'csci32-backend'

  return jwt.sign(claims, privateKey, {
    algorithm: alg as jwt.Algorithm,
    expiresIn: exp,
    audience: aud,
    issuer: iss,
    header: { typ: 'JWT' },
  } as jwt.SignOptions)
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
