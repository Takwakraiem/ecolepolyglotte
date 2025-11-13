import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function generateToken(userId: string, role: string,email:string) {
  return jwt.sign({ userId, role, email }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch (error) {
    return null
  }
}
