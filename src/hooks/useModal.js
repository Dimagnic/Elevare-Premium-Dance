import { useState, useEffect } from 'react'

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return { isOpen, open, close }
}
