// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import {Typography, CircularProgress, Box, Tab, styled} from '@mui/material'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTabList from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
// import PatientOverview from 'src/views/apps/user/view/PatientOverview';
import PatientRecordsList from  'src/views/apps/user/view/PatientRecordsList'
import PatientRecordsCreate from 'src/views/apps/user/view/PatientRecordsCreate';
import UserViewConnection from 'src/views/apps/user/view/UserViewConnection';
// import UserViewSecurity from 'src/views/apps/user/view/UserViewSecurity'
// import UserViewBilling from 'src/views/apps/user/view/UserViewBilling'
// import UserViewNotification from 'src/views/apps/user/view/UserViewNotification'

// ** Styled Tab component
const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 35,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    }
  }
}))

// FIND A WAY TO REFACTOR and REMOVE USERROUTER uselessly slow!!! and very unnecessary just keep the tabs in the same page they dont need their own page. See the AccountSettings.js you've done it there just replicated.
//
const UserViewRight = ({patientData, tab, invoiceData }) => {
  // ** State
  const [activeTab, setActiveTab] = useState(tab || 'recordsList')
  const [isLoading, setIsLoading] = useState(false)
  // const [value, setValue] = useState("recordsList")

  // ** Hooks
  // const router = useRouter()
  // const {id, recordId} = router.query;

  // REFEACTORED BELOW TO REMOVE useRouter and useEffect. No need to spend time routing elsewhere or waiting for useEffect. Also No need for invoiceData. 
  // const handleChange = (event, value) => {
    //   setIsLoading(true)
    //   setActiveTab(value)
    //   router.push({ pathname: `/apps/user/list/${value.toLowerCase()}`})
    //   .then(() => setIsLoading(false))
    // }
  // useEffect(() => {
  //   if (tab && tab !== activeTab) {
  //     setActiveTab(tab)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tab])
  // useEffect(() => {
  //   if (invoiceData) {
    //     setIsLoading(false)
    //   }
    // }, [invoiceData])
    
    const handleChange = (event, value) => {
      setIsLoading(true)
      setActiveTab(value)
      setIsLoading(false)
    }

    const tabContentList = {
      // overview: <PatientOverview />,
      recordsList: <PatientRecordsList patientData={patientData} />,
      createRecord: <PatientRecordsCreate />,
      connections: <UserViewConnection />,
      // security: <UserViewSecurity />,
      // billing-plan: <UserViewBilling />,
      // notifications: <TabNotifications />,
    }

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
      >
        {/* <Tab value='overview'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:account-outline' />
              Overview
            </Box>
          }
        /> */}
        <Tab value='recordsList'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:list-box-outline' />
              Records List
            </Box>
          }
        />
        <Tab value='createRecord'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:notebook-outline'/>
              Create Record
            </Box>
          }
        />
        <Tab value='connection'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:link' />
              Connections
            </Box>
          }
        />
        {/* <Tab value='security'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:lock-outline' />
              Security
            </Box>
          }
        /> */}
        {/* <Tab value='billing-plan'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:bookmark-outline' />
              Billing & Plan
            </Box>
          }
        /> */}
        {/* <Tab value='notification'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:bell-outline' />
              Notification
            </Box>
          }
        /> */}
      </TabList>

      <Box sx={{ mt: 4 }}>
        {isLoading ? (

          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>

        ) : (
          
          <>
            <TabPanel sx={{ p: 0 }} value={activeTab}>
              {tabContentList[activeTab]}
            </TabPanel>

              {/* <TabPanel sx={{ p: 0 }} value='overview'>
                <PatientOverview invoiceData={invoiceData} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='records-list'>
                <PatientRecordsList patientData={patientData} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='create-record'>
                <PatientRecordsCreate />
              </TabPanel> 
              <TabPanel sx={{ p: 0 }} value='connection'>
                <UserViewConnection />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='security'>
                <UserViewSecurity />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='billing-plan'>
                <UserViewBilling />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='notification'>
                <UserViewNotification />
              </TabPanel>    */}
          </>
        )}
      </Box>

    </TabContext>
  )
}

export default UserViewRight
