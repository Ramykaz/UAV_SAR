import { useRef } from 'react'
import { useInView } from 'framer-motion'

export function useScrollAnimation(amount = 0.25) {
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, { once: true, amount })
  return { ref, inView }
}
