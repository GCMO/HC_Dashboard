// ** DATA STRUCTURE: Every App. has PAGES/Apps/pages & VIEWS folders but all the data comes from Fake_DB and STORE folders. Store manages CRUD and State via REDUX. Fake_db has all hardcoded data. 


// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Cookies from 'js-cookie';

// ** MUI Imports
import {Box, Card, Menu, Grid, Button, Tooltip, MenuItem, styled, CardHeader, CardContent, IconButton, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import PatientRecordsModal from 'src/views/apps/user/view/PatientRecordsCreate'
import useFetch from 'src/hooks/useFetch'


const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Icons Vars for invoice status
const patientStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' }
}


const patientRecordList = ({ patientData }) => {
  console.log(" DATARecordList", patientData)
  const patientId = patientData?.id

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  
  const mappedRecords = patientData?.attributes.patient_records?.data.map(record => ({
    id: record.id,
    issuedDate: record.attributes.record_date,
    title: record.attributes.record_title,
    diagnosis: record.attributes.diagnosis,
    profession: record.attributes.profession,
    lifestyle: record.attributes.lifestyle,
    investigation: record.attributes.investigation,
    medication: record.attributes.medication,
    treatmentDetails: record.attributes.treatmentDetails,
    prescription: record.attributes.prescription,
    homeExercise: record.attributes.homeExercise,
    miscellaneous: record.attributes.miscellaneous,
    allergies: record.attributes.allergies,
    total: record.attributes.total,
    // patientStatus: record.attributes.status,
    patient: patientData.id
  }));

  console.log("MAPPED123", mappedRecords)

  const router = useRouter();


  // ** Vars
  const openMenu = Boolean(anchorEl)
  
  const handleClick = event => setAnchorEl(event.currentTarget)
  // CREATE THE DOWNLOADABLE TOOL 

  const handleClose = () => setAnchorEl(null) 
  
  // const handleIdCellClick = (recordId) => {
  //   router.push(`/apps/user/list/patients/${patientId}/records/${recordId}`);
    // event.defaultMuiPrevented = true;
    // setSelectedId(id); 
    // setOpenDialogue(true);
    // console.log(`Cell with id: ${id} clicked`, event);
    
  // };
    
  const handleCloseDialogue = () => setOpenDialogue(false)

  const columns = [
    {
      flex: 0.03,
      field: 'id',
      minWidth: 30,
      headerName: 'ID #',
      renderCell: ({row}) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'blue', }}>
            <LinkStyled href={`/apps/user/list/patients/${patientId}/records/${row.id}`}>{row.id}</LinkStyled>
          </Box>
        );
      },
    },
    {
      flex: 0.07,
      minWidth: 80,
      field: 'RecordDate',
      headerName: 'Recorded on:',
      renderCell: ({ row }) => <Typography variant='body2'>{row.issuedDate}</Typography>
    },
    {
      flex: 0.07,
      minWidth: 100,
      field: 'Title',
      headerName: 'Title',
      renderCell: ({ row }) => <Typography variant='body2'>{row.title}</Typography>
    },
    {
      flex: 0.19,
      minWidth: 50,
      field: 'prescription',
      headerName: 'Prescription',
      renderCell: ({ row }) => <Typography variant='body2'>{row.prescription || 0}</Typography>
    },
    {
      flex: 0.04,
      minWidth: 60,
      field: 'total',
      headerName: 'Total',
      renderCell: ({ row }) => <Typography variant='body2'>${row.total || 0}</Typography>
    },
    // {
    //   flex: 0.09,
    //   minWidth: 50,
    //   field: 'patientStatus',
    //   headerName: 'Status',
    //   // renderHeader: () => <Icon icon='mdi:trending-up' fontSize={20} />,
    //   renderCell: ({ row }) => {
    //     const { dueDate, balance, patientStatus } = row
    //     const color = patientStatusObj[patientStatus] ? patientStatusObj[patientStatus].color : 'primary'
  
    //     return (
    //       <Tooltip
    //         title={
    //           <>
    //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
    //               {patientStatus}
    //             </Typography>
    //             <br />
    //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
    //               Balance:
    //             </Typography>{' '} {balance}
    //             <br />
    //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
    //               Due Date:
    //             </Typography>{' '} {dueDate}
    //           </>
    //         }
    //       >
    //         <CustomAvatar skin='light' color={color} sx={{ width: '1.875rem', height: '1.875rem', marginLeft:'11px'}}>
    //           <Icon icon={patientStatusObj[patientStatus]?.icon} fontSize='1rem' />
    //         </CustomAvatar>
    //       </Tooltip>
    //     )
    //   }
    // },
    {
      flex: 0.07,
      minWidth: 110,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft:'-13px' }}>
          <Tooltip title='Delete patient'>
            <IconButton size='small'>
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton size='small' onClick={(event) => {
              event.stopPropagation(); 
              handleIdCellClick(row.id); 
            }}
            >
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Download'>
            <IconButton size='small' >
              <Icon icon='mdi:download' fontSize={20} />
            </IconButton>
          </Tooltip>
          {/* <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{ size: 'small' }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'Download',
                icon: <Icon icon='mdi:download' fontSize={20} />
              },
              {
                text: 'Edit',
                href: `/apps/patient/edit/${row.id}`,
                icon: <Icon icon='mdi:pencil-outline' fontSize={20} />
              },
              {
                text: 'Duplicate',
                icon: <Icon icon='mdi:content-copy' fontSize={20} />
              }
            ]}
          /> */}
        </Box>
      )
    }
  ]
    
    return (
      <>
    <Grid>  
      <Card>
        <CardHeader
          title='Patient Record List'
          sx={{ '& .MuiCardHeader-action': { m: 0 } }}
          action={
            <>
              <Button
                variant='contained'
                aria-haspopup='true'
                onClick={handleClick}
                aria-expanded={openMenu ? 'true' : undefined}
                endIcon={<Icon icon='mdi:chevron-down' />}
                aria-controls={openMenu ? 'user-view-overview-export' : undefined}
              >
                Export
              </Button>
              <Menu open={openMenu} anchorEl={anchorEl} onClose={handleClose} id='user-view-overview-export'>
                <MenuItem onClick={handleClose}>PDF</MenuItem>
                <MenuItem onClick={handleClose}>XLSX</MenuItem>
                <MenuItem onClick={handleClose}>CSV</MenuItem>
              </Menu>
            </>
          }
        />
        <CardContent>
          <DataGrid
            autoHeight
            columns={columns}
            rows={mappedRecords || []}
            // onCellClick={(params, event) => {
            //   if (params.field === 'id') {
            //     handleIdCellClick(params.id, event);
            //   }
            // }}
            disableRowSelectionOnClick
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </CardContent>

      </Card>
    </Grid>
    </>
  )
}

export default patientRecordList;