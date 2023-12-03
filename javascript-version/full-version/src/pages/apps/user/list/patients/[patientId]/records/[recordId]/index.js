// THIS FILE DISPLAYS PATIENT RECORDS CLICKED IN patientRecordsList.js
// import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { useRouter } from 'next/router';

//** 3rd Party Imports 
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker'

// ** MUI imports
import {Divider, Grid, Box, TextField, Typography, CardContent, InputLabel, Select, Snackbar, Alert} from '@mui/material';

// ** File Imports
// import { useSettings } from 'src/@core/hooks/useSettings';
import useFetch from 'src/hooks/useFetch';
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft';

// ** Styled Components
import DatePickerWrapper from 'src/views/components/react-datepicker';

const CustomInput = forwardRef((props, ref) => {
  return <TextField required fullWidth inputRef={ref} label='Date of Visit' {...props} />
})

const RecordId = ({patientData}) => { 
  console.log('paeitntDATA', patientData)
  const router = useRouter();

  if (!patientData) return <p className="mx-15 text-3xl">Error: Unable to load patient data.</p>;
  // CONSIDER CHANGING ALL THE FETCHING LOGIC INTO A HOOK BASED ON getServerSideProps. By using getServerSideProps the whole fetching logic is removed and it looks way more elegant and consistent
  
  const {data} = patientData;
  if (!data) return <p className="mx-15 text-3xl">LOADING...</p>
  if (!data.data) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>

  // const router = useRouter();
  // const { recordId } = router.query;
  // console.log("RECORDID RECORD", recordId)
  
  // // **Snackbar Hooks
  // //  const { settings } = useSettings()
  // //  const { skin } = settings
  
  // const jwtToken = Cookies.get('jwt');

  // //FETCH DATA FROM STRAPI
  // const { loading, error, data } = useFetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patient-records/${recordId}`, {
  //   method: 'GET',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });

  // if (!recordId || loading) return <p className="mx-15 text-3xl">LOADING...</p>
  // if (error) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>
  // // console.log('PRECORDid2', recordId)
  // console.log("req_PRECORDS_id", data);
  // console.log("JWT", jwtToken);

  return (
  <>              
  
  <Grid item xs={12} md={5} lg={4} sx={{marginRight:'15px', marginBottom:'15px'}}>
      <UserViewLeft patientData />
    </Grid>

    <CardContent>

      <Grid container spacing={6}>
          <Grid item xs={12} md={5} lg={4} sx={{marginRight:'15px', marginBottom:'15px'}}>
            <UserViewLeft />
          </Grid>
        
          <Grid item xs={12} md={7} lg={7.8}  sx={{ boxShadow: '2px 2px 15px rgba(0, 0, 0, 0.45)', borderRadius:'7px', paddingRight:'15px' }} >
            <Typography sx={{fontSize:'28px',  paddingBottom:'20px'}}            
            // onChange={(e) => setPatientRecordData({ ...patientRecordData, record_title: e.target.value})} 
            > <b>Record Title:</b> {data.data?.attributes?.record_title || ''}  </Typography>
         
            <DatePickerWrapper sx={{paddingBottom:'15px'}} >
              <DatePicker
                fullwidth
                selected={data?.date ? new Date(data.date) : (data.data?.attributes?.record_date ? new Date(data.data?.attributes?.record_date) : new Date())}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='YYYY-MM-DD'
                customInput={ <CustomInput/> }
                // onChange = {(date) =>  {
                //   setPatientRecordData((prevPatientRecordData) => ({ ...prevPatientRecordData, date: date, }));
                //   }}
                />
            </DatePickerWrapper>
          
            <TextField fullWidth multiline minRows={2} label='Lifestyle' placeholder='Patient Lifestyle' sx={{paddingBottom:'15px'}} 
            value={data.data?.attributes?.lifestyle}  
            // onChange = {(e) => setPatientRecordData({ ...patientRecordData, lifestyle: e.target.value})} 
            />
          
            <TextField fullWidth multiline minRows={2} label='Profession' placeholder='Patient Profession' sx={{paddingBottom:'15px'}} 
            value={'' ||  data.data?.attributes?.profession} 
            // onChange = {(e) => setPatientRecordData({ ...patientRecordData, profession: e.target.value})}
             />
          
            <TextField fullWidth multiline minRows={2} label='Medications'
              placeholder='Medications taken by patient currently'
              value={ data.data?.attributes?.medication} 
              sx={{paddingBottom:'15px'}} 
              // onChange = {(e) => setPatientRecordData({ ...patientRecordData, medication: e.target.value})}
              />
          
            <TextField fullWidth multiline minRows={2} label='Investigation' placeholder='Investigation Details' sx={{paddingBottom:'15px'}} 
            value={'' || data.data?.attributes?.investigation} 
            // onChange = {(e) => setPatientRecordData({ ...patientRecordData, investigation: e.target.value})}
            /> 
         
            <TextField fullWidth multiline minRows={2} label='Diagnosis' placeholder='Diagnosis' sx={{paddingBottom:'15px'}} 
            value={data.data?.attributes?.diagnosis } 
            // onChange = {(e) => setPatientRecordData({ ...patientRecordData, diagnosis: e.target.value})}
            />
          
            <TextField fullWidth multiline minRows={2} label='Treatment Details' placeholder='Treatment Details' 
            value={'' || data.data?.attributes?.treatmentDetails} 
            sx={{paddingBottom:'15px'}} 
            // onChange = {(e) => setPatientRecordData({ ...patientRecordData, eduTitle: e.target.value})}
            />
          
            <TextField fullWidth multiline minRows={2} label='Prescription' placeholder='Prescription' sx={{paddingBottom:'15px'}} 
            value = {'' || data.data?.attributes?.prescription} 
            // onChange = {(e) => setPatientRecordData({...patientRecordData, prescription: e.target.value })}
            />
          
            <TextField fullWidth multiline minRows={2} label='Exercise' placeholder='Patient Homework Exercises' sx={{paddingBottom:'15px'}} 
            value={'' || data.data?.attributes?.homeExercise} 
            // onChange = {(e) => setPatientRecordData({ ...patientRecordData, homeExercise: e.target.value})} 
            />
          
            <TextField fullWidth multiline minRows={2} label='Miscellaneous' placeholder='Miscellaneous' sx={{paddingBottom:'15px'}} 
            value = {'' || data.data?.attributes?.miscellaneous} 
            // onChange = {(e) => setPatientRecordData({...patientRecordData, prescription: e.target.value })}
            />  
          </Grid>
      </Grid>
    </CardContent>

    <Divider sx={{ my: theme => `${theme.spacing(0)} !important` }} />

    </>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const recordId = params.recordId; 
  console.log("RECORDID", recordId)

  const jwtToken = context.req.cookies.jwt; // access cookies from the server side
  console.log("JWT", jwtToken)

  // const jwtToken = Cookies.get('jwt');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patient-records/${recordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

  if (!res.ok) {
    throw new Error(`Failed to fetch. Status: ${res.status}`);
  }

  const patientData = await res.json();
  console.log('PATIENTDATA', patientData)
    return { props: { patientData } };
  } catch (error) {
    console.error('Failed to fetch patient data:', error);
    return { 
      props: { 
        patientData: null, error: error.message 
      } 
    };
  }
}

export default RecordId;
