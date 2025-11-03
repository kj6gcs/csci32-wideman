// Note: As I was having significant issues getting authorization through the GraphQL GUI to work properly,
// I utilized ChatGPT to help debug/resolve some errors I was facing.
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

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

// -------------------------
// Algorithm selection (kept minimal, robust)
// -------------------------
// Prefer JWT_ALG (backend env), then ALGORITHM (legacy)
const envAlg = (process.env.JWT_ALG ?? process.env.ALGORITHM) as jwt.Algorithm | undefined

function inferAlg(): jwt.Algorithm {
  if (JWT_SECRET) return 'HS256'
  if (PRIVATE_KEY) {
    if (/BEGIN RSA/i.test(PRIVATE_KEY)) return 'RS256'
    if (/BEGIN EC/i.test(PRIVATE_KEY)) return 'ES256'
    // Generic "BEGIN PRIVATE KEY" — ask Node what it is
    try {
      const k = crypto.createPrivateKey(PRIVATE_KEY)
      return k.asymmetricKeyType === 'rsa' ? 'RS256' : k.asymmetricKeyType === 'ec' ? 'ES256' : 'RS256'
    } catch {
      return 'RS256'
    }
  }
  throw new Error('No JWT signing material found (set JWT_SECRET or PRIVATE_KEY).')
}

const ALG: jwt.Algorithm = envAlg ?? inferAlg()

// Basic sanity checks to avoid mismatches
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

// -------- password helpers --------
export async function hashPassword(plain: string): Promise<string> {
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12)
  return bcrypt.hash(plain, rounds)
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

// -------- token signing --------
export function signToken(claims: Record<string, unknown>): string {
  const exp = process.env.JWT_EXPIRES_IN ?? process.env.EXPIRATION ?? '2h'
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

// -------- minimal header verification helper (use in your existing server file) --------
export function verifyAuthHeader(req: { headers?: Record<string, unknown> }) {
  const raw = (req.headers?.authorization as string | undefined) ?? (req.headers?.Authorization as string | undefined)

  if (!raw || !raw.startsWith('Bearer ')) return null

  const token = raw.slice(7)
  const pubPem = (process.env.PUBLIC_KEY || '').replace(/\\n/g, '\n')

  try {
    const payload = jwt.verify(token, isHmac ? (JWT_SECRET as string) : pubPem, {
      algorithms: [ALG],
      audience: process.env.AUD || 'csci32-frontend',
      issuer: process.env.ISS || 'csci32-backend',
      clockTolerance: 5, // seconds
    }) as any

    return {
      id: payload.sub as string | undefined,
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      role: payload.role as string | undefined,
      permissions: payload.permissions as string[] | undefined,
      raw: payload, // optional for debugging
    }
  } catch {
    return null
  }
}
