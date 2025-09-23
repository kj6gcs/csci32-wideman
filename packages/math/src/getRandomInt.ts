export function getRandomInt(min: number, max: number, rng: () => number = Math.random): number {
  const lo = Math.ceil(Math.min(min, max))
  const hi = Math.floor(Math.max(min, max))
  if (hi <= lo) return lo
  return Math.floor(rng() * (hi - lo + 1)) + lo
}
