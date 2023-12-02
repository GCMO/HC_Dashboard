// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
// import UsersInvoiceListTable from 'src/views/apps/user/view/UsersInvoiceListTable';
// import UsersTimelineListTable from 'src/views/apps/user/view/UsersTimelineListTable';
// import UsersProjectListTable from 'src/views/apps/user/view/UsersProjectListTable';

// this is the TabOVERVIEW file
const UserViewOverview = ({invoiceData, patientData }) => {
  return (
    <Grid container spacing={6}>

       <Grid item xs={12}>
        <UsersProjectListTable />
      </Grid>

      <Grid item xs={12}>
        <UsersInvoiceListTable invoiceData={invoiceData} />
      </Grid>
      
      {/* THIS COMPONENT USED TO DISPLAY A TIMELINE OF USER ACTIVITIES MAY TURN OUT USEFUL LATER. RIGHT NOW W/ NO DATA, JUST A WAIST OF TIME.  */}
       <Grid item xs={12}>
         <UsersTimelineListTable />
        </Grid> 

    </Grid>
  )
}

export default UserViewOverview
