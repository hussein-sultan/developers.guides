'use client'

import Box from "@mui/material/Box"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import { CustomDialogProps } from "@/types/customs"
import { useState } from "react"

export default function CustomDialog({ trigger, title, setOpen, open, actions, children }: CustomDialogProps) {
  const [inOpen, setInOpen] = useState<boolean>(false) // we will use internal state when there is no external state

  const handleOpen = () => setOpen ? setOpen(true) : setInOpen(true)
  const handleClose = () => setOpen ? setOpen(false) : setInOpen(false)

  return (
    <>
      {!inOpen && <Box onClick={handleOpen}>{trigger}</Box>}

      <Dialog open={open ?? inOpen} onClose={handleClose} >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        {
          actions && (
            <DialogActions>
              {actions}
            </DialogActions>
          )
        }
      </Dialog >
    </>
  )
}