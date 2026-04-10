"use client";

import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { CustomAlertProps } from "@/types/customs";
import { useAlert } from "@/hooks/useAlert";

export default function CustomAlert({ message, severity, variant, icon, duration, trigger }: CustomAlertProps) {
  const { open, handleOpen, handleClose } = useAlert(message, trigger)

  return (
    <>
      {trigger && <Box onClick={handleOpen}>{trigger}</Box>}

      <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={duration ?? 6000} onClose={handleClose}>
        <Alert
          icon={icon}
          onClose={handleClose}
          severity={severity}
          variant={variant}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}