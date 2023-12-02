import { useState } from 'react'

// ** MUI Imports
import { CardContent, Grid, FormControl, InputLabel, Select, MenuItem, Divider, Box, Button, TextField } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// EXPORBTN - SEARCH - ADDBTN
const TableHeader = props => {
  // ** States
  const [role, setRole] = useState('');
  const [plan, setPlan] = useState('');

  
  // ** Props
  const { handleFilter, handleRoleChange, handlePlanChange, handleStatusChange, toggle, value } = props
  

  return (
    <Box sx={{ pt: 3, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>

        <CardContent sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

            <Grid container spacing={3}>
              <Grid item width='250px' sm={6} xs={6}>
                <FormControl size='small' fullWidth >
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='patient'>Patient</MenuItem>
                    <MenuItem value='supplier'>Supplier</MenuItem>
                    <MenuItem value='salesman'>Salesman</MenuItem>
                    <MenuItem value='property-owner'>Venue Owner</MenuItem>
                    <MenuItem value='staff'>Staff</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item sm={4} xs={12}>
                <FormControl size='small' fullWidth>
                  <InputLabel id='plan-select'>Select Plan</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id='select-plan'
                    label='Select Plan'
                    labelId='plan-select'
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}
                  >
                    <MenuItem value=''>Select Plan</MenuItem>
                    <MenuItem value='basic'>Basic</MenuItem>
                    <MenuItem value='company'>Company</MenuItem>
                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                    <MenuItem value='team'>Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>  */}
              <Grid item sm={6} xs={6}>
                <FormControl size='small' fullWidth sx={{ width: '100%' }}>
                  <InputLabel id='status-select'>Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label='Select Status'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Status</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>

      <Box sx={{ pt: 2, pl:5, pr: 4,  display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          sx={{ mr: 3, mb: 2 }}
          color='primary'
          variant='outlined'
          startIcon={<Icon icon='mdi:export-variant' fontSize={10} />}
        >
          Export
        </Button>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 3, mb: 2 }}
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
        />

        <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
          Add Patient
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
