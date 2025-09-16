'use client'
import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { Size } from '@repo/ui/size'
import { Variant } from '@repo/ui/variant'
import { useState } from 'react'
import React from 'react'
import Image from 'next/image'
import Footer from '../../components/footer'

export default function ButtonPage() {
  const [name, setName] = useState('')
  const [hobby, setHobby] = useState('')
  const [goal, setGoal] = useState('')

  return (
    <div>
      <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Image
            src="/starwovenBanner.png"
            alt="Starwoven Banner & Tagline"
            width={1400}
            height={600}
            className="mx-auto -mt-16"
          />
        </div>
        <div className="flex gap-4 flex-wrap justify-center mt-10">
          <div className="w-full text-center text-amber-400">
            <p>Create An In-Universe ID Card:</p>
          </div>
          <div className="flex gap-2">
            <Input value={name} setValue={setName} size={Size.MEDIUM} variant={Variant.PRIMARY} name="name" id="name" />
            <Button onClick={() => alert(`Your name is: ${name}`)} size={Size.MEDIUM} variant={Variant.PRIMARY}>
              Character Name
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              value={hobby}
              setValue={setHobby}
              size={Size.MEDIUM}
              variant={Variant.SECONDARY}
              name="hobby"
              id="hobby"
            />
            <Button onClick={() => alert(`Your hobby is: ${hobby}`)} size={Size.MEDIUM} variant={Variant.SECONDARY}>
              Galactic Alliance
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              value={goal}
              setValue={setGoal}
              size={Size.MEDIUM}
              variant={Variant.TERTIARY}
              name="goal"
              id="goal"
            />
            <Button onClick={() => alert(`Your goal is: ${goal}`)} size={Size.MEDIUM} variant={Variant.TERTIARY}>
              Ship Name
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
