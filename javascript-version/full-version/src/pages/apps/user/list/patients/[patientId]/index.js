// React Imports
import { useRouter } from 'next/router'
import Cookies from 'js-cookie';

// MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import useFetch from 'src/hooks/useFetch';
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft';
import UserViewRight from 'src/views/apps/user/view/UserViewRight';

const PatientDetails = ({ tab, invoiceData }) => {

  const router = useRouter();
  const { patientId } = router.query;
  console.log("PATIENTID", patientId)
  // !patientId ? params.patientId : patientId

  const jwtToken = Cookies.get('jwt');

  // FETCH DATA FROM STRAPI
  // we need only the data from the patient whose ID was clicked in the DataGrid 
  const { loading, error, data } = useFetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patients/${patientId}?populate=patient_records`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (loading) return <p className="mx-15 text-3xl">LOADING...</p>
  if (error) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>
  console.log("PATIENTdetails", data);
  console.log('PAT_id', patientId)
  console.log("JWT", jwtToken);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft patientData={data.data} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight patientData={data.data} tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default PatientDetails;
