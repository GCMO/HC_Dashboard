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


// ** Styled Components
import DatePickerWrapper from 'src/views/components/react-datepicker'

// import Close from 'mdi-material-ui/Close'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


const ImgStyled = styled('img')(({ theme }) => ({
  width: 230,
  height: "auto",
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

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

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' required fullWidth {...props} />
})

const TabAccount = () => {
  // ** State
  const [open, setOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState(false)
  const [userInput, setUserInput] = useState('yes')
  const [inputValue, setInputValue] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userData, setUserData] = useState({
    mobile: undefined,
    website: undefined,
    company: undefined,
    location:undefined,
    country: undefined,
    city: undefined,
    date: new Date() ,
    gender: undefined,
    profilePic: { url: '' || undefined, name: undefined, id: undefined, width: undefined, height: undefined },
  })

  // ** Hooks
  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { checkbox: false } })
  const handleClose = () => setOpen(false)
  const handleSecondDialogClose = () => setSecondDialogOpen(false)
  const onSubmit = () => setOpen(true)
  
  // **Snackbar Hooks
  const { settings } = useSettings()
  const { skin } = settings

  const handleCloseSnackBtn = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }
  
  
  // Data Fetching -- STRAPI decodes the JWT automatically using users/me (except for PUT and we still have to use ${id}). 
  // Media Fetching -- STRAPI has a separate collection for media so always ?populated=* the url 
  const jwtToken = Cookies.get('jwt');

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
    setSecondDialogOpen(true)
  }

  // const handleInputImageChange = file => {
  //   const reader = new FileReader()
  //   const { files } = file.target
  //   if (files && files.length !== 0) {
  //     reader.onload = () => setImgSrc(reader.result)
  //     reader.readAsDataURL(files[0])
  //     if (reader.result !== null) {
  //       setInputValue(reader.result)
  //     }
  //   }
  // }
  const hanldeImgUploadBtn = (file) => {
    const fileReader = new FileReader();
    const { files } = file.target;
  
    if (files && files.length !== 0) {
      fileReader.onload = () => setImgSrc(fileReader.result);
      const selectedFile = files[0];
      fileReader.readAsDataURL(selectedFile);
  
      // Check file size max 500KB
      if (selectedFile.size > 500 * 1024) {
        alert('Image size exceeds the limit (500KB). Please choose a smaller image.');
      } else {
        // Create a FormData object to send the file with all the metadata required
        const formData = new FormData();
        formData.append('files', selectedFile);
        // POST the image to the server
        fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload?populate=users/me`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
          })

          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              const uploadedImage = data[0];
  
              if (uploadedImage.id) {
                const imageId = uploadedImage.id;
                console.log('Uploaded Image ID:', imageId);
  
                // Update the authenticated user with the new image ID
                fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/${id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                  },
                  body: JSON.stringify({ profilePic: imageId }),
                })
                
                .then((updateResponse) => {
                  if (updateResponse.status !== 200) {
                    throw new Error(`HTTP error! Status: ${updateResponse.status}`);
                  }

                  return updateResponse.json();
                })

                .then((userData) => {  // Update userData with the image URL and ID                    
                  setUserData((prevUserData) => ({
                    ...prevUserData,
                    profilePic: {
                      id: imageId,
                      name: uploadedImage.name,
                      url: uploadedImage.url,
                      height: uploadedImage.height,
                      width: uploadedImage.width
                    },
                  }));
                  console.log('User data updated successfully:', userData);
                })
                .catch((error) => {
                    console.error('Error updating user data:', error);
                });
              } else {
                console.error('Uploaded image ID is missing or invalid.');
              }
            } else {
              console.error('No image data found in the response.');
            }
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
          });
      }
    } else {
      console.error('No file selected for upload.');
    }
  };

  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
  }

  // const handleFormChange = (field, value) => {
  //   setFormData({ ...formData, [field]: value })
  // }
  const saveChangesBtn = async () => {
    try {
  
      const updatedUserData = {
        mobile: userData.mobile,
        website: userData.website,
        company: userData.company,
        location: userData.location,
        country: userData.country,
        city: userData.city,
        date: userData.date ? new Date(userData.date) : new Date(),
        gender: userData.gender,
      };
  
      console.log('1-Changes saved successfully', updatedUserData);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedUserData),
        });
  
        if (response.ok) {
          console.log('2-Changes saved successfully', updatedUserData);
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
          <CardHeader title='Account Settings' />

          <form>
            <CardContent sx={{ pb: theme => `${theme.spacing(10)}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data?.profilePic?.url}` || imgSrc }  alt="Profile Pic"/> 
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      value={inputValue}
                      id='account-settings-upload-image'
                      accept='image/png, image/jpeg'
                      onChange={hanldeImgUploadBtn}
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImageReset}>
                    Reset
                  </ResetButtonStyled>

                  <Typography variant='caption' sx={{ mt: 4, display: 'block', color: 'text.disabled' }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </div>
              </Box>
            </CardContent>

            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth label='Full Name'
                    placeholder='John Doe'
                    value={`${data.firstname} ${data.lastname}`} 

                    // onChange={e => saveChangesBtn('firstName', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePickerWrapper>
                    <DatePicker
                      required
                      selected={data.date ? new Date(data.date) : userData.date}
                      showYearDropdown
                      showMonthDropdown
                      id='account-settings-date'
                      placeholderText='MM-DD-YYYY'
                      customInput={ <CustomInput/> }
                      onChange={(date) =>  {
                        setUserData((prevUserData) => ({ ...prevUserData, date: date, }));
                        }}
                      />
                  </DatePickerWrapper>
                </Grid> 

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Username' value={ data.username } />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type='email' label='Email'
                    placeholder='john.doe@example.com' value={data.email}

                    // onChange={e => saveChangesBtn('email', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth label='Mobile' placeholder='ThemeSelection'
                    value={userData.mobile || data.mobile}
                    onChange={(e) => setUserData({ ...userData, mobile: e.target.value })} 
                    InputProps={{ startAdornment: <InputAdornment position='start'>SE (+46)</InputAdornment> }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Website' placeholder='https://example.com' 
                    value={userData.website || data.website}
                    onChange={(e) => setUserData({ ...userData, website: e.target.value })} 
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Company Name' placeholder='MyPractice AB'
                    value={userData.company || data.company } 
                    onChange={(e) => setUserData({ ...userData, company: e.target.value })} 
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth label='Address' placeholder='The address where you deliver treatments' 
                  value={userData.location || data.location } 
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })}/>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth label='City'  placeholder='The city or nearest centrum to where you deliver treatments' value={ userData.city || data.city} onChange={(e) => setUserData({ ...userData, city: e.target.value })} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel required>Country</InputLabel>
                    <Select
                      label='Country'
                      value = { userData.country || data.country }
                      renderValue={(selected) => selected}
                      onChange = {(e) => { 
                        const selectedCountry = e.target.value;
                        setUserData((prevUserData) => ({ ...prevUserData, country: selectedCountry, }));
                      }}
                    >
                      <MenuItem value='Sweden'>Sweden</MenuItem>
                      <MenuItem value='Norway'>Norway</MenuItem>
                      <MenuItem value='Finland'>Finland</MenuItem>
                      <MenuItem value='Denmark'>Denmark</MenuItem>
                      <MenuItem value='Germany'>Germany</MenuItem>
                      <MenuItem value='Holland'>Holland</MenuItem>
                      <MenuItem value='France'>France</MenuItem>
                      <MenuItem value='Italy'>Italy</MenuItem>
                      <MenuItem value='Spain'>Spain</MenuItem>
                      <MenuItem value='Portugal'>Portugal</MenuItem>
                      <MenuItem value='Greece'>Greece</MenuItem>
                      <MenuItem value='Uk'>UK</MenuItem>
                      <MenuItem value='United Kingdom'>United Kingdom</MenuItem>
                      <MenuItem value='United States'>United States</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
                    <RadioGroup row aria-label='gender'
                    value={userData.gender || data.gender}  
                    onChange={(e) => setUserData({ ...userData, gender: (e.target).value})}>
                      <FormControlLabel value='male' label='Male' control={<Radio />} />
                      <FormControlLabel value='female' label='Female' control={<Radio />} />
                      <FormControlLabel value='other' label='Other' control={<Radio />} />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Fragment>
                    <Button variant='contained' sx={{ mr: 4 }} onClick={saveChangesBtn}>
                      Save Changes
                    </Button>
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
                        Data Succesfully Saved
                      </Alert>
                    </Snackbar>
                  </Fragment>
                  <Button type='reset' variant='outlined' color='secondary' onClick={() => setFormData(initialData)}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>

      {/* Delete Account Card */}
      <Grid item xs={12}  >
      <Accordion>
        <AccordionSummary
          expandIcon={<Icon icon='mdi:chevron-down' fontSize='1.5rem' />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">Delete Account</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 4 }}>
              <FormControl>
                <Controller
                  name='checkbox'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControlLabel
                      label='I confirm my account deactivation'
                      sx={errors.checkbox ? { '& .MuiTypography-root': { color: 'error.main' } } : null}
                      control={
                        <Checkbox
                          {...field}
                          size='small'
                          name='validation-basic-checkbox'
                          sx={errors.checkbox ? { color: 'error.main' } : null}
                        />
                      }
                    />
                  )}
                />
                {errors.checkbox && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-checkbox'>
                    Please confirm you want to delete account
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            <Button variant='contained' color='error' type='submit' disabled={errors.checkbox !== undefined}>
              Deactivate Account
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
      </Grid>

      {/* Deactivate Account Dialogs */}
      <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
        <DialogContent sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box sx={{ 
            display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'center',
              '& svg': { mb: 6, color: 'warning.main' }
            }}
          >
            <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
            <Typography>Are you sure you would like to cancel your subscription?</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
        <DialogContent sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column',
              '& svg': { mb: 8, color: userInput === 'yes' ? 'success.main' : 'error.main' }
            }}
          >
            <Icon fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 5 }}>
              {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Your subscription cancelled successfully.' : 'Unsubscription Cancelled!!'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </Grid>
  )
}

export default TabAccount
