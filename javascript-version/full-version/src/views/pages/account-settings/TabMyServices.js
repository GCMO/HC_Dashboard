/* eslint-disable lines-around-comment */
/* eslint-disable padding-line-between-statements */
// ** React Imports
import { useState, Fragment, forwardRef, ChangeEvent, SyntheticEvent } from 'react'

// ** MUI Imports
import { Alert, Snackbar, Box, Button, Grid, Card, Select, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogContent, DialogActions, Checkbox, MenuItem, TextField, Typography, InputLabel, CardHeader, FormControl, FormLabel, RadioGroup, Radio, CardContent, FormHelperText, InputAdornment, FormControlLabel, styled } from '@mui/material';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

// ** Hooks
import useFetch from 'src/hooks/useFetch'
import { useSettings } from 'src/@core/hooks/useSettings'


// import Close from 'mdi-material-ui/Close'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))


const TabMyServices = () => {
  
  const jwtToken = Cookies.get('jwt');

  // ** State
  const [open, setOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [userInput, setUserInput] = useState('yes')
  const [inputValue, setInputValue] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [serviceData, setServiceData] = useState({
    service_title: undefined,
    service_description: undefined,
    service_duration: undefined,
    service_price: undefined,
    service_currency: '' || undefined,
    service_partipants:undefined,
    service_modality: undefined,
  })

  // ** Hooks
  const handleClose = () => setOpen(false)
  const onSubmit = () => setOpen(true)
  
  // **Snackbar Hooks
  const { settings } = useSettings()
  const { skin } = settings  

  // FETCH DATA
  const { loading, error, data } = useFetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/me?populate=*`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (loading) return <p className="mx-15 text-3xl">LOADING...</p>
  if (error) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>
  
  console.log("USER", data);
  console.log("JWT", jwtToken);
  
  // decode the User Id from JWT (we have to use id for every PUT for now, they may update STRAPI later)
  const idDecoder = jwt_decode(jwtToken || undefined);
  console.log("ID", idDecoder);
  const id = idDecoder.id;


  const handleConfirmation = value => {
    handleClose()
    setUserInput(value)
  }

  const handleCloseSnackBtn = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const handleInputReset = () => {
    setInputValue('')
  }
  
  const saveChangesBtn = async () => {
    try {
      const updatedUserService = {
        service_title: serviceData.service_title,
        service_description: serviceData.service_description,
        service_duration: serviceData.service_duration,
        service_price: serviceData.service_price,
        service_currency: serviceData.service_currency,
        service_participants: serviceData.service_participants,
        service_modality: serviceData.service_modality,
        user: id,
      };
  
      console.log('1- Changes saved successfully', updatedUserService);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedUserService),
        });
  
        if (response.ok) {
          console.log('2- Changes saved successfully', updatedUserService);
          setOpenSnackbar(true)
        } else {
          console.log('Failed to save changes');
      };
        console.log('No changes to save.');
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  // ADD VALIDATORS TO THE FORM, copy from login form!!!!

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='My Services' />
          <form>
            
          <CardContent>
            <Box sx={{ background:'#4579cc', borderRadius:'7px', padding:'15px', mb:"35px",  }} >
              <Typography sx={{ ml:"3px", fontStyle:"italic", }} > 
                In this section please describe precisely the services you will provide. We recommend you keep a maximum of 5 services to make it easier for your clients to choose from. We have noticed that therapists offering more services, receive less bookings.  <br/>
                Each services will be later selectable in your private Calendar of appointments as ready-made options and visible to customers in your profile section.
              </Typography>
            </Box>

              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <TextField required fullWidth label='Service Title'
                    placeholder='Acupuncture Appointment'
                    value={serviceData.service_title || data.services.service_title} 
                    onChange={(e) => setServiceData({ ...serviceData, service_title: e.target.value.toUpperCase()}) }
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField fullWidth minRows={2} label='Service Description' 
                    placeholder='During this acupuncture appointment, we will discuss your health concerns. I will take your pulse and apply niddles to specific points, to stimulate your whole system. At the end of the treatment we will discuss a plan and next steps'
                    value={serviceData.service_description || data.services.service_description}
                    onChange={(e) => setServiceData({ ...serviceData, service_description: e.target.value}) }

                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel required>Currency</InputLabel>
                    <Select
                      label='Currency'
                      renderValue={(selected) => selected}
                      value = { serviceData.service_currency|| data.services.service_currency }
                      onChange = {(e) => { 
                        const selectedCurrency = e.target.value;
                        setServiceData((prevUserService) => ({ ...prevUserService, currency: selectedCurrency, }));
                      }}
                    >
                      <MenuItem value='SEK'>SEK</MenuItem>
                      <MenuItem value='NOR'>NOR</MenuItem>
                      <MenuItem value='DKK'>DKK</MenuItem>
                      <MenuItem value='EUR'>EUR</MenuItem>
                      <MenuItem value='USD'>USD</MenuItem>
                      <MenuItem value='BTC'>BTC</MenuItem>
                      <MenuItem value='ETH'>ETH</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required 
                    label='Price' placeholder='only numbers, please no dots or commas'
                    value={serviceData.service_price || data.services.service_price} 
                    onChange={(e) => setServiceData({ ...serviceData, service_price: e.target.value })} 
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel required>Duration</InputLabel>
                    <Select
                      label='Duration'
                      renderValue={(selected) => selected}
                      value = { serviceData.service_duration || data.services.service_duration }
                      onChange = {(e) => { 
                        const selectedDuration = e.target.value;
                        setServiceData((prevUserService) => ({ ...prevUserService, duration: selectedDuration }));
                      }}
                    >
                      <MenuItem value='30'>30 min</MenuItem>
                      <MenuItem value='45'>45 min</MenuItem>
                      <MenuItem value='60'>60 min</MenuItem>
                      <MenuItem value='90'>90 min</MenuItem>
                      <MenuItem value='120'>120 min</MenuItem>
                      <MenuItem value='150'>150 min</MenuItem>
                      <MenuItem value='180'>180 min</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel required sx={{ fontSize: '0.875rem' }}>Participants</FormLabel>
                    <RadioGroup row aria-label='participants'
                    value={serviceData.service_participants || data.services.service_participants}  
                    onChange={(e) => setServiceData({ ...serviceData, service_participants: e.target.value })}
                    
                    >
                      <FormControlLabel value='private' label='Private' control={<Radio />} />
                      <FormControlLabel value='couple' label='Couple' control={<Radio />} />
                      <FormControlLabel value='group' label='Group' control={<Radio />} />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel required sx={{ fontSize: '0.875rem' }}>Modality</FormLabel>
                    <RadioGroup row aria-label='modality'
                    value={serviceData.service_modality || data.services.service_modality}  
                    onChange={(e) => setServiceData({ ...serviceData, service_modality: e.target.value })}
                    >
                      <FormControlLabel value='online' label='Online' control={<Radio />} />
                      <FormControlLabel value='inperson' label='In Person' control={<Radio />} />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{mb: 10}}>
                  <Fragment>
                    <ButtonStyled variant='contained' sx={{ mr: 4, }} onClick={saveChangesBtn}>
                      Save Changes
                    </ButtonStyled>
                    <Snackbar 
                      open={openSnackbar} 
                      onClose={handleCloseSnackBtn} 
                      autoHideDuration={3000}>
                      <Alert 
                        variant='filled' 
                        severity='success' 
                        sx={{width:'100%'}}
                        onClose={handleCloseSnackBtn} 
                        elevation={skin === 'bordered' ? 0 : 3}> 
                        Service Succesfully Saved
                      </Alert>
                    </Snackbar>
                  </Fragment>

                  <ResetButtonStyled type='reset' variant='outlined' color='secondary' onClick={() => handleInputReset()}>
                    Reset
                  </ResetButtonStyled>

                </Grid>
              </Grid>

            <Grid item xs={12}>
              <Box sx={{ background:'#4579cc', borderRadius:'7px', padding:'15px', marginBottom:"5px",  }} >
                <Typography sx={{ marginLeft:"15px", fontStyle:"italic",  }} > 
                  All of your services are displayed below. You can choose to delete or hide them at any time. 
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              { data.services.map((service) => (
                <Box key={service} sx={{ display:'flex', flexDirection:'row', alignItems: 'center', background:'lightgrey', borderRadius:'7px', padding:'15px', mb:"5px",  }} >
                  <Typography sx={{ background:'lightsteelblue', px:'10px', py:'8px', borderRadius:'5px', mx:"15px", fontWeight:'800', color:'black', boxShadow:'0 2px 4px rgba(0, 0, 0, 0.2)' }} > 
                    {`${service.service_title} - ${service.service_currency}${service.service_price} - ${service.service_duration} - ${service.service_participants} - ${service.service_modality}`}
                  </Typography>
                  <Button variant='contained' sx={{mx:'15px',}} >Delete</Button>
                  {/* <ButtonStyled variant='outlined'>Hide</ButtonStyled> */}
                </Box>
              ))}
            </Grid>

            

            </CardContent>
          </form>
          
        </Card>

      </Grid>
    </Grid>
  )
}

export default TabMyServices;
