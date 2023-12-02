// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {Grid, Dialog, DialogTitle, DialogContent, Select, Switch, MenuItem, TextField, Typography, InputLabel, FormControl,  DialogActions, InputAdornment, FormControlLabel, DialogContentText, styled} from '@mui/material';

// ** Hooks Imports
import useFetch from 'src/hooks/useFetch';

// ** Styled <sup> components
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const PatientRecordsModal = ({ openModal, onClose, selectedId }) => {
  
  if (!openModal) return null;
  console.log('Modal open prop:', openModal)

  const {loading, error, data} = useFetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patient-records/${selectedId}`, {
      method: 'GET', 
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
    }, openModal && selectedId
  );

    if (loading) return <p className="mx-15 text-3xl">LOADING...</p>
    if (error) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>
    
    console.log("P-RECORDS", data);

return (
    <Dialog open={openModal} onClose={onClose}
      aria-labelledby='user-view-edit'
      aria-describedby='user-view-edit-description'
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
    >

      <DialogTitle id='user-view-edit'
      sx={{ textAlign: 'center', fontSize: '1.5rem !important',
        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
        pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
      }}
      > {`${data.patient_fullName} record #${selectedId} from ${data.record_date}`}
      </DialogTitle>

      <DialogContent
      sx={{ pb: theme => `${theme.spacing(8)} !important`,
        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
      }} >

      <form>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Profession' defaultValue={data?.attributes?.profession} /> 
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Lifestyle' defaultValue={data.lifestyle} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Medications' defaultValue={data.medication} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Investigation' defaultValue={data.investigation} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Diagnosis' defaultValue={data.diagnosis} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='treatmentDetails' defaultValue={data.username}
              InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Prescription' defaultValue={data.prescription} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Home Exercise' defaultValue={data.homeExercise} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Miscellaneous' defaultValue={data.miscellaneous} />
          </Grid>
            <FormControl fullWidth>
              <InputLabel id='user-view-status-label'>Status</InputLabel>
              <Select label='Status' defaultValue={data.status}
                id='user-view-status' labelId='user-view-status-label'
              >
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='TAX ID' defaultValue='Tax-8894' />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel label='Use as a billing address?'
              control={<Switch defaultChecked />}
              sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
            />
          </Grid>
        </form>
      </DialogContent>
        {/* <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={handleCloseDialogue}>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleCloseDialogue}>
            Cancel
          </Button>
        </DialogActions> */}

      </Dialog>
  )
}

export default PatientRecordsModal;