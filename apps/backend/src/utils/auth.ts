// apps/backend/src/utils/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// --- env helpers ---
function readEnvMultiline(name: string): string | undefined {
  const v = process.env[name]
  if (!v) return undefined
  return v.includes('\\n') ? v.replace(/\\n/g, '\n') : v
}
function readEnvBase64(name: string): string | undefined {
  const b64 = process.env[name]
  if (!b64) return undefined
  return Buffer.from(b64, 'base64').toString('utf8')
}

// Prefer PRIVATE_KEY (PEM, with \n), or PRIVATE_KEY_B64; alternatively use JWT_SECRET for HMAC
const PRIVATE_KEY = readEnvMultiline('PRIVATE_KEY') ?? readEnvBase64('PRIVATE_KEY_B64')

const JWT_SECRET = process.env.JWT_SECRET

// Choose algorithm:
// - If you have a PRIVATE_KEY and no explicit ALGORITHM, default to ES256 (ECDSA).
// - If you only have JWT_SECRET and no ALGORITHM, default to HS256.
const explicitAlg = process.env.ALGORITHM as jwt.Algorithm | undefined
const ALG: jwt.Algorithm = explicitAlg ?? (PRIVATE_KEY ? 'ES256' : 'HS256')

// Basic sanity checks to avoid the “alg parameter…” confusion:
const isHmac = ALG.startsWith('HS')
const isRsa = ALG.startsWith('RS') || ALG.startsWith('PS')
const isEc = ALG.startsWith('ES')

if (isHmac && !JWT_SECRET) {
  throw new Error('ALG is HMAC (HS*), but JWT_SECRET is not set.')
}
if (!isHmac && !PRIVATE_KEY) {
  throw new Error(`ALG is ${ALG}, but PRIVATE_KEY/PRIVATE_KEY_B64 is not set.`)
}

// Optional: warn if the PEM header looks mismatched (heuristic only)
if (PRIVATE_KEY && isEc && /BEGIN RSA/i.test(PRIVATE_KEY)) {
  // eslint-disable-next-line no-console
  console.warn('Warning: Using ES* algorithm with a key that looks like RSA.')
}
if (PRIVATE_KEY && isRsa && /BEGIN EC/i.test(PRIVATE_KEY)) {
  // eslint-disable-next-line no-console
  console.warn('Warning: Using RS*/PS* algorithm with a key that looks like EC.')
}

export async function hashPassword(plain: string): Promise<string> {
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12)
  return bcrypt.hash(plain, rounds)
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export function signToken(claims: Record<string, unknown>): string {
  const exp = process.env.EXPIRATION ?? '2h'
  const aud = process.env.AUD ?? 'csci32-frontend'
  const iss = process.env.ISS ?? 'csci32-backend'

  if (isHmac) {
    // HMAC (shared secret)
    return jwt.sign(
      claims,
      JWT_SECRET as string,
      {
        algorithm: ALG,
        expiresIn: exp,
        audience: aud,
        issuer: iss,
        header: { typ: 'JWT' },
      } as jwt.SignOptions,
    )
  } else {
    // Asymmetric (EC or RSA)
    return jwt.sign(
      claims,
      PRIVATE_KEY as string,
      {
        algorithm: ALG,
        expiresIn: exp,
        audience: aud,
        issuer: iss,
        header: { typ: 'JWT' },
      } as jwt.SignOptions,
    )
  }
}
