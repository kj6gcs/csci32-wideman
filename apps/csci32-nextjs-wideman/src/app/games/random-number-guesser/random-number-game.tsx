'use client'

import { useState, type FormEvent, type ChangeEvent } from 'react'
import type { GuessingGameEngineProps } from './page'
import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'

export default function RandomNumberGame({ randomNumber, endGame, maxGuessCount }: GuessingGameEngineProps) {
  const [guessCount, setGuessCount] = useState(0)
  const [feedback, setFeedback] = useState<string>('')
  const [guess, setGuess] = useState<string>('')
  const [gameOver, setGameOver] = useState(false)
  const [hasWon, setHasWon] = useState(false)

  const onChangeGuess = (e: ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value)
  }

  function submitGuess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (gameOver) return

    const val = Number(guess)
    if (!Number.isFinite(val)) return

    const newGuessCount = guessCount + 1

    if (val === randomNumber) {
      setFeedback(
        `I guess you are lucky! You won in ${newGuessCount} ${newGuessCount === 1 ? 'try' : 'tries'}! Must be nice!`,
      )
      setHasWon(true)
      setGameOver(true)
    } else {
      setFeedback(val < randomNumber ? 'Too low, too slow!' : 'You flew too high and got burned by the sun!')
      if (newGuessCount >= maxGuessCount) {
        setFeedback(`Out of guesses. The number was ${randomNumber}.`)
        setHasWon(false)
        setGameOver(true)
      }
    }

    setGuessCount(newGuessCount)
    setGuess('')
  }

  function onSubmitEndGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuessCount(0)
    setFeedback('')
    setGameOver(false)
    setHasWon(false)
    endGame()
  }

  const oneLeft = !gameOver && maxGuessCount - guessCount === 1
  const rootBg = gameOver ? (hasWon ? 'bg-green-400' : 'bg-red-400') : oneLeft ? 'bg-stone-400' : ''

  return (
    <div className={`${rootBg} p-10 rounded-md transition-colors`}>
      {gameOver ? (
        <form className="flex flex-col gap-4" onSubmit={onSubmitEndGame}>
          <div className="text-base font-medium">{feedback}</div>
          <Button>End Game</Button>
        </form>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={submitGuess}>
          <Input
            id="guess"
            name="guess"
            type="number"
            placeholder="Enter your guess"
            value={guess}
            onChange={onChangeGuess}
            required
          />

          {feedback && <div className="text-sm">{feedback}</div>}
          <div className="text-sm">
            You have guessed <span className="font-medium">{guessCount}</span> time{guessCount === 1 ? '' : 's'}.
          </div>
          <div className="text-sm">
            You have <span className="font-medium">{Math.max(0, maxGuessCount - guessCount)}</span> guesses left.
          </div>
          <div className="text-sm italic opacity-80">Do you feel lucky, punk? Do you?</div>
          <div>
            <Button>Guess</Button>
          </div>
        </form>
      )}
    </div>
  )
}
