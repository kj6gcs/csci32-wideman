'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { Size } from '@repo/ui/size'
import { Variant } from '@repo/ui/variant'

type AuthFormInputs = {
  name?: string
  email: string
  password: string
}

export default function Auth() {
  const { signUp, signIn, signOut, isLoading, error, clearError } = useAuth()
  const [isSignUpMode, setIsSignUpMode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>()

  const onSubmit = async (data: AuthFormInputs) => {
    if (isSignUpMode) {
      const result = await signUp(data)
      console.log('Signed up:', result)
    } else {
      const result = await signIn({ email: data.email, password: data.password })
      console.log('Signed in:', result)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-slate-800 text-amber-400 rounded-lg shadow-xl shadow-black">
      <h2 className="text-2xl font-bold mb-6 text-center">{isSignUpMode ? 'Sign Up' : 'Log On'}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={clearError} className="ml-2 text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isSignUpMode && (
          <Input
            type="text"
            placeholder="Name (optional)"
            size={Size.LARGE}
            variant={Variant.PRIMARY}
            {...register('name')}
          />
        )}

        <Input
          type="email"
          placeholder="Email"
          size={Size.LARGE}
          variant={Variant.PRIMARY}
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <Input
          type="password"
          placeholder="Password"
          size={Size.LARGE}
          variant={Variant.PRIMARY}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <div className="w-full">
          <Button size={Size.LARGE} variant={Variant.PRIMARY} className="w-full">
            {isLoading ? 'Loading...' : isSignUpMode ? 'Sign Up' : "Let's get at it!"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsSignUpMode(!isSignUpMode)}
          className="text-amber-400 text-sm font-medium"
        >
          {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={signOut}
          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
