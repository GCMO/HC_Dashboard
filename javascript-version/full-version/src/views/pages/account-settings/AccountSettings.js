// ** React/Next Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import { Tab, Box, Grid, Typography, CircularProgress, styled, useMediaQuery} from '@mui/material'
import { TabPanel, TabContext, MuiTab} from '@mui/lab/';
import MuiTabList from '@mui/lab/TabList';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** File Imports
import TabAccount from 'src/views/pages/account-settings/TabAccount';
import TabBilling from 'src/views/pages/account-settings/TabBilling';
import TabProfile from 'src/views/pages/account-settings/TabProfile.js';
import TabSecurity from 'src/views/pages/account-settings/TabSecurity';
import TabMySerices from 'src/views/pages/account-settings/TabMyServices';

// import TabConnections from 'src/views/pages/account-settings/TabConnections'
// import TabNotifications from 'src/views/pages/account-settings/TabNotifications'

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'default'
  },
  '& .Mui-selected': {
    // backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.primay} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    }
  }
}))

// const Tabs = styled(MuiTab)(({ theme }) => ({
//   [theme.breakpoints.down('md')]: {
//     minWidth: 100
//   },
//   [theme.breakpoints.down('sm')]: {
//     minWidth: 67
//   }
// }))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AccountSettings = ({ tab, apiPricingPlanData }) => {
  // ** State
  const [activeTab, setActiveTab] = useState(tab)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState("account")

  // ** Hooks
  const hideText = useMediaQuery(theme => theme.breakpoints.down('md'))

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    setIsLoading(false)
  }

  // useEffect(() => {
  //   if (tab && tab !== activeTab) {
  //     setActiveTab(tab)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tab])

  const tabContentList = {
    account: <TabAccount />,
    security: <TabSecurity />,
    profile: <TabProfile />,
    myservices: <TabMySerices />,
    billing: <TabBilling apiPricingPlanData={apiPricingPlanData} />,
    // connections: <TabConnections />,
    // notifications: <TabNotifications />,
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TabList
                variant='scrollable'
                scrollButtons='auto'
                onChange={handleChange}
                aria-label='customized tabs example'
              >
                <Tab
                  value='account'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon icon='mdi:cogs' />
                      {!hideText && 'Account'}
                    </Box>
                  }
                />
                <Tab
                  value='security'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon icon='mdi:lock-open-outline' />
                      {!hideText && 'Security'}
                    </Box>
                  }
                />
                <Tab
                  value='profile'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon icon='mdi:account-outline' />
                      {!hideText && 'Profile'}
                    </Box>
                  }
                />
                <Tab
                  value='myservices'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon icon='mdi:toolbox-outline' />
                      {!hideText && 'My Services'}
                    </Box>
                  }
                />
                <Tab
                  value='billing'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon icon='mdi:piggy-bank-outline' />
                      {!hideText && 'Billing'}
                    </Box>
                  }
                />
                {/* <Tab
                  value='notifications'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon icon='mdi:bell-outline' />
                      {!hideText && 'Notifications'}
                    </Box>
                  }
                />
                <Tab
                  value='connections'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon icon='mdi:link' />
                      {!hideText && 'Connections'}
                    </Box>
                  }
                /> */}
              </TabList>
            </Grid>
            <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
              {isLoading ? (
                <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <CircularProgress sx={{ mb: 4 }} />
                  <Typography>Loading...</Typography>
                </Box>
              ) : (
                <TabPanel sx={{ p: 0 }} value={activeTab}>
                  {tabContentList[activeTab]}
                </TabPanel>
              )}
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default AccountSettings
