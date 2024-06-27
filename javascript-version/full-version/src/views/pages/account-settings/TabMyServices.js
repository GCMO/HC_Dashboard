/* eslint-disable lines-around-comment */
/* eslint-disable padding-line-between-statements */
// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import { Alert, Snackbar, Box, Button, Grid, Card, Select, Checkbox, MenuItem, TextField, Typography, InputLabel, CardHeader, FormControl, FormLabel, RadioGroup, Radio, CardContent, FormControlLabel, styled } from '@mui/material';

// ** Third Party Imports
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

// ** Hooks
import useFetch from 'src/hooks/useFetch'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Styles
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
  // decode the User Id from JWT (we have to use id for every PUT for now, they may update STRAPI later)
  const idDecoder = jwt_decode(jwtToken || undefined);
  console.log("ID", idDecoder);
  const id = idDecoder.id;


  // ** State
  const [inputValue, setInputValue] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [servicesList, setServicesList] = useState([]); // services rendered at the bottom of the page.
  const [serviceData, setServiceData] = useState({
    service_title: "",
    service_description: "",
    service_duration: "",
    service_price: "",
    service_currency: "",
    service_participants: "" ,
    service_modality: "",
  })
  
  // **Snackbar Hooks
  const { settings } = useSettings()
  const { skin } = settings  
  
  const handleCloseSnackBtn = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const handleInputReset = () => {
    setInputValue('')
  }
  
  // FETCH DATA
  const { loading, error, data } = useFetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/me?populate=*`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  // update serviceList state with data just fetched, any changes will be displayed pronto
  useEffect(() => { 
    if (data && data.services) {
      console.log("Fetched services:", data.services);
      setServicesList(data.services);
    }
  }, [data]);

  if (loading) return <p className="mx-15 text-3xl">LOADING...</p>
  if (error) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>
  if (!servicesList.length) return <p className="mx-15 text-3xl">No services found.</p>;

  console.log("USER", data);
  console.log("JWT", jwtToken);

  
  // CREATE SERVICE
  const saveChangesBtn = async () => {
    try {
      const updatedServiceData = {
        data:{
          service_title: serviceData.service_title,
          service_description: serviceData.service_description,
          service_duration: serviceData.service_duration,
          service_price: serviceData.service_price,
          service_currency: serviceData.service_currency,
          service_participants: serviceData.service_participants,
          service_modality: serviceData.service_modality,
          user: id,
        }
      };
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedServiceData),
        });
        console.log('RESPONSE', response)
  
        if (response.ok) {
          const newService = await response.json();
          console.log('Changes saved successfully', newService);
          // Update the state to reflect the new service just created
          setServicesList(prevServices => [...prevServices, newService.data.attributes]); 
          setOpenSnackbar(true)
        } else {
          console.log('Failed to save changes');
          setOpenSnackbar(false)
      };
        // console.log('No changes to save.');
    } catch (error) {
      console.error('Error saving changes:', error);
    }

    handleInputReset();
  };

  // DELETE SERVICE

  const handleDeleteService = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log('RESPONSE', response)
      if (response.ok) {
        console.log('Service deleted successfully');
          // Update state to reflect deletion
        setServicesList(prevServices => prevServices.filter(service => service.id !== id));

      setOpenSnackbar(true)

      } else {
        console.log('Failed to delete service');
        setOpenSnackbar(false)
      }
    } catch (error) {
      console.error('Error deleting service:', error);
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
                In this section please describe precisely the services you will provide. Each service will be later selectable in your private Calendar of appointments as ready-made options and visible to customers in your profile section. <br/><br/>
                - We have noticed that therapists offering more services, receive less bookings. So, we recommend you publish a maximum of 5 services to make it easier for your customers to choose from.   
                
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
                      value = { serviceData.service_currency }
                      onChange = {(e) => { 
                        setServiceData((prevUserService) => ({ ...prevUserService, service_currency: e.target.value }));
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
                    value={serviceData.service_price || " "} 
                    onChange={(e) => setServiceData({ ...serviceData, service_price: e.target.value })} 
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel required>Duration</InputLabel>
                    <Select
                      label='Duration'
                      renderValue={(selected) => selected}
                      value = { serviceData.service_duration }
                      onChange = {(e) => { 
                        setServiceData((prevUserService) => ({ ...prevUserService, service_duration: e.target.value }));
                      }}
                    >
                      <MenuItem value='min:30'>min:30</MenuItem>
                      <MenuItem value='min:45'>min:45</MenuItem>
                      <MenuItem value='min:60'>min:60</MenuItem>
                      <MenuItem value='min:90'>min:90</MenuItem>
                      <MenuItem value='min:120'>min:120</MenuItem>
                      <MenuItem value='min:150'>min:150</MenuItem>
                      <MenuItem value='min:180'>min:180</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel required sx={{ fontSize: '0.875rem' }}>Participants</FormLabel>
                    <RadioGroup row aria-label='participants'
                      value={serviceData.service_participants}  
                      onChange={(e) => { setServiceData((prevUserService) => ({ ...prevUserService, service_participants: e.target.value })); }}
                    >
                      <FormControlLabel value='Private' label='Private' control={<Radio />} />
                      <FormControlLabel value='Couple' label='Couple' control={<Radio />} />
                      <FormControlLabel value='Group' label='Group' control={<Radio />} />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel required sx={{ fontSize: '0.875rem' }}>Modality</FormLabel>
                    <RadioGroup row aria-label='modality'
                    value={serviceData.service_modality}  
                    onChange={(e) => { setServiceData((prevUserService) => ({ ...prevUserService, service_modality: e.target.value })); }}
                    >
                      <FormControlLabel value='Online' label='Online' control={<Radio />} />
                      <FormControlLabel value='In Person' label='In Person' control={<Radio />} />
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
                  All of your services are displayed below and on you Profile page. You can choose to delete them at any time. 
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              { servicesList.map((service) => (
                <Box key={service.id} sx={{ display:'flex', flexDirection:'row', alignItems: 'center', justifyContent:'space-between', background:'lightgrey', borderRadius:'7px', padding:'15px', mb:"5px",  }} >
                  <Typography sx={{ background:'lightsteelblue', px:'10px', py:'7px', borderRadius:'5px', mx:"15px", color:'black', boxShadow:'0 2px 4px rgba(0, 0, 0, 0.2)' }} > 
                    <b className='text-black-800'>{service.service_title} </b>  
                    - {service.service_currency} {service.service_price} - {service.service_duration} 
                    - {service.service_participants} - {service.service_modality}
                  </Typography>
                  <Button  sx={{px:'10px', py:'7px', color:'white', borderRadius:'5px', backgroundColor:'#cf5757', boxShadow:'0 2px 4px rgba(0, 0, 0, 0.3)'}}
                    onClick={ ()=>handleDeleteService(service.id) } >Delete</Button>
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
