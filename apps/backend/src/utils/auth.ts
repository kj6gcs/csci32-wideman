// apps/backend/src/utils/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

/** Normalize PEM from .env (supports one-line values with \n escapes or true multiline). */
const toPEM = (v?: string) => {
  if (!v) throw new Error('Missing PEM key in env')
  return v.replace(/\\n/g, '\n').trim()
}

/** Config (supports JWT_* names first, falls back to older names). */
const ALG = (process.env.JWT_ALG ?? process.env.ALGORITHM ?? 'RS256') as jwt.Algorithm
const EXPIRES_IN = process.env.JWT_EXPIRATION ?? process.env.EXPIRATION ?? '1h'
const AUDIENCE = process.env.JWT_AUD ?? process.env.AUD ?? 'csci32-frontend'
const ISSUER = process.env.JWT_ISS ?? process.env.ISS ?? 'csci32-backend'

function readPrivateKeyPEM(): string {
  const key = process.env.PRIVATE_KEY
  if (!key) throw new Error('Missing PRIVATE_KEY in .env')
  return toPEM(key)
}

function readPublicKeyPEM(): string {
  const key = process.env.PUBLIC_KEY
  if (!key) throw new Error('Missing PUBLIC_KEY in .env')
  return toPEM(key)
}

/** Guard: make sure selected alg matches key type (helps catch EC-vs-RSA mixups). */
function assertAlgMatchesKey(privateKeyPem: string, alg: string) {
  const isEC = privateKeyPem.includes('BEGIN EC PRIVATE KEY')
  const isRSA = privateKeyPem.includes('BEGIN RSA PRIVATE KEY') || privateKeyPem.includes('BEGIN PRIVATE KEY')
  if (isEC && !alg.startsWith('ES')) {
    throw new Error(`Configured JWT_ALG=${alg} but EC key detected. Use ES256/384/512 or switch to RSA keys.`)
  }
  if (isRSA && !(alg.startsWith('RS') || alg.startsWith('PS'))) {
    throw new Error(`Configured JWT_ALG=${alg} but RSA key detected. Use RS256/384/512 or PS256/384/512.`)
  }
}

/** Password hashing. */
export async function hashPassword(plain: string): Promise<string> {
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12)
  return bcrypt.hash(plain, rounds)
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

/** Sign a JWT with the configured private key + algorithm. */
export function signToken(claims: Record<string, unknown>): string {
  const privateKey = readPrivateKeyPEM()
  assertAlgMatchesKey(privateKey, ALG)

  return jwt.sign(
    claims as object,
    privateKey as jwt.Secret, // help TS pick the right overload
    {
      algorithm: ALG, // <-- singular for sign
      expiresIn: EXPIRES_IN,
      audience: AUDIENCE,
      issuer: ISSUER,
      header: { typ: 'JWT' },
    } as jwt.SignOptions,
  )
}

/** Verify a JWT with the configured public key + algorithm. */
export function verifyToken<T extends object = any>(token: string): T {
  const publicKey = readPublicKeyPEM()
  const payload = jwt.verify(
    token,
    publicKey as jwt.Secret, // help TS
    {
      algorithms: [ALG], // <-- plural for verify
      audience: AUDIENCE,
      issuer: ISSUER,
    } as jwt.VerifyOptions,
  )
  return payload as T
}
