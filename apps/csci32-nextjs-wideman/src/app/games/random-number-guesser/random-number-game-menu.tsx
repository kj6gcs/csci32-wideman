'use client'
import { Button } from '@repo/ui/button'
import type { GuessingGameMenuProps } from './page'
import { useState } from 'react'
import { Input } from '@repo/ui/input'

export default function RandomNumberGameMenu({ startGame }: GuessingGameMenuProps) {
  const [showSettings, setShowSettings] = useState(false)

  function onSubmitSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const min = Number(data.get('min'))
    const max = Number(data.get('max'))
    const maxGuessCount = Number(data.get('maxGuessCount'))

    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      !Number.isFinite(maxGuessCount) ||
      min >= max ||
      maxGuessCount <= 0
    ) {
      return
    }

    startGame({ min, max, maxGuessCount })
    setShowSettings(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {showSettings ? (
        <div className="flex flex-col gap-4">
          <header>
            <h1 className="text-2xl font-bold">Please enter the minimum and maximum guess values</h1>
          </header>
          <form className="flex flex-col gap-4" onSubmit={onSubmitSettings}>
            <Input defaultValue={0} type="number" placeholder="Minimum guessing value" name="min" id="min" />
            <Input defaultValue={10} type="number" placeholder="Maximum guessing value" name="max" id="max" />
            <Input
              defaultValue={3}
              type="number"
              placeholder="Allotted guesses"
              name="maxGuessCount"
              id="maxGuessCount"
            />
            <Button>Submit</Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Yay. You&apos;ve made it.</h1>
            <p>Don&apos;t mistake my lack of excitement to mean this is a boring game.</p>
            <p>
              Or do. You&apos;re probably over there, asking yourself &quot;Do I pick the number six or only five?&quot;
            </p>
            <p>
              There&apos;s only really one question you should be asking, and that&apos;s &quot;Do I feel lucky?&quot;
            </p>
            <p>Well, do you, Punk?</p>
          </header>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowSettings(true)
            }}
          >
            <Button>Get to Movin&#39;!</Button>
          </form>
        </div>
      )}
    </div>
  )
}
