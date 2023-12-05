// THE ACTUAL PATIENT LIST 
// THIS WHOLE MESSY FILE NEEDS A DESPERATE REFACTOR!!! 
// THERE IS SO MUCH STUFF IN HERE THAT CAN BE TURNED INTO COMPONENTS

// ** React Imports
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ** Third Party Components
import axios from 'axios'

// ** MUI Imports
import { Box, Card, Menu, Grid, Divider, styled, MenuItem, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
// import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Vars
// ENSURE THE KEYS ARE CHANGED - TO DO SO YOU SHOULD CHANGE THE STORE
const userRoleObj = {
  venueOwner: { icon: 'mdi:bank', color: 'error.main' },
  salesman: { icon: 'mdi:pencil-outline', color: 'warning.main' },
  supplier: { icon: 'mdi:chart-donut', color: 'info.main' },
  patient: { icon: 'mdi:account-outline', color: 'success.main' },
  staff: { icon: 'mdi:cog-outline', color: 'primary.main' }
}

const defaultColor = 'black';

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** CLIENT AVATAR RENDER
const renderClient = row => {
  if (row.avatar.length) {
    return  <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

// ** 3DOTS OPTION-MENU
const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  // const handleEdit = () => {
  //   dispatch(editUser(id)) ==> create PUT in the store 
  //    handleRowOptionsClose()
  //   console.log();
  // }

  return (
    <>
      <IconButton size='large' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem onClick={handleRowOptionsClose} 
          component={Link} sx={{ '& svg': { mr: 2 } }}
          href={`/apps/user/list/patients/${id}`} // id here is a prop
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        {/* <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem> */}
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
};

// DATAGRID objects
const columns = [
  {
    flex: 0.1,
    minWidth: 230,
    field: 'fullName',
    headerName: 'FullName',
    renderCell: ({ row }) => {
      const { fullName, username } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <LinkStyled href={`/apps/user/list/patients/${row.id}`}>{row.fullName}</LinkStyled>
            {/* <Typography noWrap variant='caption'>
              {`@${username}`}
            </Typography> */}
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 230,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 180,
    field: 'address',
    headerName: 'Address',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.address}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 180,
    field: 'company',
    headerName: 'Company',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.company}
        </Typography>
      )
    }
  },
  {
    flex: 0.08,
    field: 'role',
    minWidth: 130,
    headerName: 'Role',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: userRoleObj[row.role] ? userRoleObj[row.role].color : defaultColor} }}>
          <Icon icon={userRoleObj[row.role]?.icon} fontSize={20} />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role} 
          </Typography>
        </Box>
        // 
      )
    }
  },
  // {
  //   flex: 0.15,
  //   minWidth: 120,
  //   headerName: 'Plan',
  //   field: 'currentPlan',
  //   renderCell: ({ row }) => {
  //     return (
  //       <Typography noWrap sx={{ textTransform: 'capitalize' }}>
  //         {row.currentPlan}
  //       </Typography>
  //     )
  //   }
  // },
  {
    flex: .08,
    minWidth: 100,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.status}
          color={userStatusObj[row.status]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: (params) => <RowOptions id={params.row.id} sx={{ paddingLeft:'15px' }} />
  }
]

const UserList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  // const handlePlanChange = useCallback(e => {
  //   setPlan(e.target.value)
  // }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      {/* +++ DONNOT REMOVE THIS CODE - these are the stats boxes+++
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon} />} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid> */}
      <Grid item xs={12}>
        <Card>

          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          
          <Divider />
          
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            // checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

// this getStaticProps is to fetch the Card Stats, which is now hidden from rendering: line 305.
// export const getStaticProps = async () => {
//   const res = await axios.get('/cards/statistics')
//   const apiData = res.data

//   return {
//     props: {
//       apiData
//     }
//   }
// }

export default UserList
