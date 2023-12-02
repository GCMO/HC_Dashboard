// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {Drawer, Select, Button, MenuItem, TextField, IconButton, InputLabel, Typography, Box, FormControl, FormHelperText, styled, Autocomplete} from '@mui/material';
import { countries } from 'src/@fake-db/autocomplete'


// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

//** Styled Components
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}
// Form Validation
const schema = yup.object().shape({
  fullName: yup.string()
  .min(3, obj => showErrors('Full Name', obj.value.length, obj.min))
  .required(),
  email: yup.string().email().required(),
  contact: yup.number().typeError('Contact Number field is required')
  .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min)),
  company: yup.string(), 
  country: yup.string().required(), 
  // countryCode: yup.number().typeError('Contry Code is required')
  // .min(2, obj => showErrors('Country Code', obj.value.length, obj.min)).required(),
  // city: yup.string().required(),
  address: yup.string()
    .min(3, obj => showErrors('Address', obj.value.length, obj.min))
    .required(),
  patient_SSN: yup.number().typeError('NIN Number field is required')
  .min(10, obj => showErrors('NSS Number not correct', obj.value.length, obj.min)),
})

const defaultValues = {
  fullName: '',
  email: '',
  contact: Number(''),
  country: '',
  countryCode:'',
  city: '',
  address:'',
  patient_SSN: '',
  // username: '',
}

const SidebarAddCustomer = props => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('patient')

  // ** Redux Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  const { reset, control, setValue, setError, handleSubmit, formState: { errors } } = 
    useForm({
      defaultValues,
      mode: 'onChange',
      resolver: yupResolver(schema)
    })

  const onSubmit = data => {
    // VAL.: CHECKS IF EMAIL & USERNAME ALREADY EXIST. Strapi does that
    // if (store.allData?.some(u => u.email === data.email )) {
    //   store.allData.forEach(u => {
    //     if (u.email === data.email) {
    //       setError('email', {
    //         message: 'Email already exists!'
    //       })
    //     }
    //     if (u.username === data.username) {
    //       setError('username', {
    //         message: 'Username already exists!'
    //       })
    //     }
    //   })
    // } else {
      dispatch(addUser({ ...data, role, currentPlan: plan }))
      toggle()
      reset()
    // }
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('patient')
    setValue('contact', Number(''))
    toggle()
    reset()
  }

  return (
    <Drawer open={open} anchor='right' variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>ADD PATIENT</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller name='fullName' control={control} rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required label='Full Name' placeholder='John Doe'
                  value={value} 
                  onChange={onChange}
                  error={Boolean(errors.fullName)}
                />
              )}
            />
            {errors.fullName && 
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors.fullName.message}
            </FormHelperText>}
          </FormControl>


          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller name='email' control={control} rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField required type='email' label='Email' placeholder='johndoe@email.com'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3, display: 'flex', flexDirection: 'row' }}>
            {/* <Controller
              name='countryCode'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  required
                  value={value}
                  label='Code'
                  onChange={onChange}
                  placeholder={+46}
                  error={Boolean(errors.countryCode)}
                  sx={{ marginRight: 1, width: '30%', maxWidth: '100px', }} 
                >
                  <MenuItem value="C.Code">Country Code</MenuItem>
                  <MenuItem label='Sweden' value="+46">+46</MenuItem>
                  <MenuItem label='Denmark' value="+45">+45</MenuItem>
                  <MenuItem label='UK' value="+44">+44</MenuItem>
                  <MenuItem label='Norway' value="+47">+47</MenuItem>
                  <MenuItem label='Finland' value="+358">+358</MenuItem>
                </Select>
              )}
            /> */}
            <Autocomplete
              autoHighlight
              sx={{ width: '48%', maxWidth: '200px', }}
              id='autocomplete-country-select'
              options={countries}
              getOptionLabel={option => option.code + ' +' + option.phone || '' }
              renderOption={(props, option) => (
                <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
                  <img alt='' width='20' loading='lazy'
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  />
                   ({option.code}) + {option.phone}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Country Code'
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password'
                  }}
                />
              )}
            />
            <Controller name='contact' control={control} rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField required type='number' value={value} label='Mobile'
                  sx={{ marginLeft: 1, width: '71%' }}  placeholder='072945153'
                  onChange={onChange}
                  error={Boolean(errors.contact)}
                />
              )}
            />
            {errors.contact && 
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors.contact.message}
            </FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller name='patient_SSN' control={control} rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField value={value} label='National Insurance Number' placeholder='NGFCG38SA'
                  onChange={onChange}
                  error={Boolean(errors.patient_SSN)}
                />
              )}
            />
            {errors.patient_SSN && 
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.patient_SSN.message}
              </FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller name='address' control={control} // rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField value={value} label='Address' placeholder='234 Rochester Street'
                  onChange={onChange}
                  error={Boolean(errors.address)}
                />
              )}
            />
            {errors.address && 
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors.address.message}
            </FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller name='city' control={control} // rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField value={value} label='City' placeholder='Stockholm'
                  onChange={onChange}
                  error={Boolean(errors.country)}
                />
              )}
            />
            {errors.country && <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller name='country' control={control} // rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField value={value} label='Country' placeholder='Australia'
                  onChange={onChange}
                  error={Boolean(errors.country)}
                />
              )}
            />
            {errors.country && <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller name='company' control={control} // rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField value={value} label='Company' placeholder='Google LTD.'
                  onChange={onChange}
                  error={Boolean(errors.country)}
                />
              )}
            />
            {errors.country && <FormHelperText sx={{ color: 'error.main' }}>{errors.company.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select fullWidth value={role} id='select-role' label='Select Role' labelId='role-select' inputProps={{ placeholder: 'Select Role' }}
              onChange={e => setRole(e.target.value)}
            >
              <MenuItem value='patient'>Patient</MenuItem>
              <MenuItem value='supplier'>Supplier</MenuItem>
              <MenuItem value='saleman'>Salesman</MenuItem>
              <MenuItem value='venueowner'>Venue Owner</MenuItem>
              <MenuItem value='staff'>Staff</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id='plan-select'>Select Plan</InputLabel>
            <Select fullWidth id='select-plan' label='Select Plan' labelId='plan-select'
              value={plan}
              onChange={e => setPlan(e.target.value)}
              inputProps={{ placeholder: 'Select Plan' }}
            >
              <MenuItem value='basic'>Basic</MenuItem>
              <MenuItem value='company'>Company</MenuItem>
              <MenuItem value='enterprise'>Enterprise</MenuItem>
              <MenuItem value='team'>Team</MenuItem>
            </Select>
          </FormControl>
                {/* add VALIDATORS SO THERE IS NO SUBMIT IF THE FORM IS NOT COMPLETE */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} >
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddCustomer
