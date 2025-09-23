'use client'

import { useState } from 'react'
import RandomNumberGame from './random-number-game'
import RandomNumberGameMenu from './random-number-game-menu'
// Returns a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export interface StartGameProps {
  min: number
  max: number
  maxGuessCount: number
}

export interface GuessingGameMenuProps {
  startGame: (props: StartGameProps) => void
}

export interface GuessingGameEngineProps {
  randomNumber: number
  maxGuessCount: number
  endGame: () => void
}

export default function RandomNumberGuesser() {
  const [isGameInProgress, setIsGameInProgress] = useState(false)
  const [randomNumber, setRandomNumber] = useState(0)
  const [maxGuessCount, setMaxGuessCount] = useState(0)

  function startGame({ min, max, maxGuessCount }: StartGameProps) {
    const newRandomNumber = getRandomInt(min, max)
    setRandomNumber(newRandomNumber)
    setMaxGuessCount(maxGuessCount)
    setIsGameInProgress(true)
  }

  function endGame() {
    setIsGameInProgress(false)
  }

  return (
    <div className="p-24 max-w-[800px] mx-auto">
      {isGameInProgress ? (
        <RandomNumberGame endGame={endGame} randomNumber={randomNumber} maxGuessCount={maxGuessCount} />
      ) : (
        <RandomNumberGameMenu startGame={startGame} />
      )}
    </div>
  )
}
