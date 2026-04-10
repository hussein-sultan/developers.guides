import { useEffect, useState } from 'react'

export function useAlert(message?: string | React.ReactNode, trigger?: React.ReactElement) {
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  // Open the alert when the message changes and there is no trigger element to open it manually
  useEffect(() => {
    const timer = setTimeout(() => { // we use a timeout to ensure the alert opens after the component has rendered
      if (message && !trigger) handleOpen()
    }, 0)

    return () => clearTimeout(timer)
  }, [message, trigger])

  return { open, handleClose, handleOpen }
}