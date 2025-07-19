import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

// Admin credentials (in production, these should be in environment variables)
const ADMIN_EMAIL = 'hi@streck.in'
const ADMIN_PASSWORD = 'Streck@123!'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = sign(
        { 
          email: ADMIN_EMAIL,
          role: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        },
        JWT_SECRET
      )

      // Return success response
      return NextResponse.json({
        success: true,
        token,
        user: {
          email: ADMIN_EMAIL,
          role: 'admin',
          name: 'STRECK Admin'
        },
        message: 'Login successful'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 