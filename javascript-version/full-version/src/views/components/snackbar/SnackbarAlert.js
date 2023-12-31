// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

const SnackbarAlert = () => {
  // ** State
  const [open, setOpen] = useState(false)

  // ** Hook & Var
  const { settings } = useSettings()
  const { skin } = settings

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }


  return (
    <Fragment>
      <Button variant='outlined' onClick={handleClick}>
        Open alert snackbar
      </Button>
      <Snackbar open={open} onClose={handleClose} autoHideDuration={3000}>
        <Alert
          variant='filled'
          severity='success'
          onClose={handleClose}
          sx={{ width: '100%' }}
          elevation={skin === 'bordered' ? 0 : 3}
        >
          Data Saved Successfully!
        </Alert>
      </Snackbar>
    </Fragment>
  )
}

export default SnackbarAlert
