// THIS FILE DISPLAYS PATIENT RECORDS CLICKED IN patientRecordsList.js
// import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { useRouter } from 'next/router';

//** 3rd Party Imports 
import Cookies from 'js-cookie';
import cookie from 'cookie';
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

const RecordId = ({ patientData }) => { 

  // if (!patientData) return <p className="mx-15 text-3xl">Error: Unable to load patient data.</p>;
  // If `pRecord` is null, it means there is no record with the specified recordId
  // if (!pRecord) return <p>Error: Record not found.</p>;

  // CONSIDER CHANGING ALL THE FETCHING LOGIC INTO A HOOK BASED ON getServerSideProps. By using getServerSideProps the whole fetching logic is removed and it looks way more elegant and consistent
  
  // **Snackbar Hooks
  //  const { settings } = useSettings()
  //  const { skin } = settings

  const router = useRouter();
  const { recordId, patientId } = router.query;
  console.log("RECORDID", recordId)
  console.log("PATIENTID", patientId)
  
  const jwtToken = Cookies.get('jwt');

  // FETCH DATA FROM STRAPI
  const { loading, error, data } = useFetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patients/${patientId}?populate[patient_records][filters][id]=${recordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!recordId || loading) return <p className="mx-15 text-3xl">LOADING...</p>
  if (error) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>
  console.log("req_Patient&Records_id", data);
  console.log("JWT", jwtToken);

  const pRecord = data.data?.attributes.patient_records.data[0];
  console.log("recordIdDATA", pRecord )



  return (
  <>              

    <CardContent>
      <Grid container spacing={6}>

          <Grid item xs={12} md={5} lg={4} sx={{marginRight:'9px', marginBottom:'15px'}}>
            <UserViewLeft patientData={data.data} />
          </Grid>

          <Grid item xs={12} md={7} lg={7.8}  sx={{ boxShadow: '2px 2px 15px rgba(0, 0, 0, 0.45)', borderRadius:'7px', paddingRight:'15px' }} >
            <Typography sx={{fontSize:'28px',  paddingBottom:'20px'}}            
            > Record Title: <b>{''|| pRecord?.attributes?.record_title || '' }</b>  </Typography>
         
            <DatePickerWrapper sx={{paddingBottom:'15px'}} >
              <DatePicker
                fullwidth
                selected={data?.date ? new Date(data.date) : (pRecord?.attributes?.record_date ? new Date(pRecord?.attributes?.record_date) : new Date())}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='YYYY-MM-DD'
                customInput={ <CustomInput/> }
                />
            </DatePickerWrapper>
          
            <TextField fullWidth multiline label='Lifestyle' placeholder='Patient Lifestyle' sx={{paddingBottom:'15px'}} 
            value={''|| pRecord?.attributes?.lifestyle || ''}  
            />
          
            <TextField fullWidth multiline label='Profession' placeholder='Patient Profession' sx={{paddingBottom:'15px',}} 
            value={''|| pRecord?.attributes?.profession || ''}  
             />

            <TextField fullWidth multiline label='Allergies' placeholder='Patient Allergies' sx={{paddingBottom:'15px'}} 
            value={''|| pRecord?.attributes?.allergies || ''}  
             />
          
            <TextField fullWidth multiline label='Medications'
              placeholder='Medications taken by patient currently'
              value={''|| pRecord?.attributes?.medication || ''} 
              sx={{paddingBottom:'15px'}}  
              />
          
            <TextField fullWidth multiline label='Investigation' placeholder='Investigation Details' sx={{paddingBottom:'15px'}} 
            value={''|| pRecord?.attributes?.investigation || ''}  
            /> 
         
            <TextField fullWidth multiline label='Diagnosis' placeholder='Diagnosis' sx={{paddingBottom:'15px'}} 
            value={''||pRecord?.attributes?.diagnosis || '' }  
            />
          
            <TextField fullWidth multiline label='Treatment Details' placeholder='Treatment Details' 
            value={''|| pRecord?.attributes?.treatmentDetails || ''} 
            sx={{paddingBottom:'15px'}}  
            />
          
            <TextField fullWidth multiline label='Prescription' placeholder='Prescription' sx={{paddingBottom:'15px'}} 
            value = {''|| pRecord?.attributes?.prescription ||''}  
            />
          
            <TextField fullWidth multiline label='Exercise' placeholder='Patient Homework Exercises' sx={{paddingBottom:'15px'}} 
            value={''|| pRecord?.attributes?.homeExercise ||''}  
            />
          
            <TextField fullWidth multiline label='Miscellaneous' placeholder='Miscellaneous' sx={{paddingBottom:'15px'}} 
            value = {'' || pRecord?.attributes?.miscellaneous ||'' }  
            />  
          </Grid>
        </Grid>
    </CardContent>

    <Divider sx={{ my: theme => `${theme.spacing(0)} !important` }} />

    </>
  );
};

// export async function getServerSideProps(context) {
//   const { recordId, patientId,  req } = context;
//   console.log ('PARAMSgetServerSideProps', context)

//   try {
//     // Parse cookies from the request & adjust the key if necessary
//     const parsedCookies = cookie.parse(req.headers.cookie || '');
//     const jwtToken = parsedCookies.jwt; 
//     console.log("SSR_JWT", jwtToken)

//     if (!jwtToken) {
//       throw new Error("JWT token is not available");
//     }

//     const res = await fetch (`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patients/${patientId}?populate[patient_records][filters][id]=${recordId}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${jwtToken}`,
//       },
//     })

//     if (!res.ok) { throw new Error(`Failed to fetch. Status: ${res.status}`); }

//     const patientData = await res.json();
//     console.log('PppppDATA', patientData)

//     const pRecord = patientData.data?.attributes.patient_records.data[0];

//     if (!patientData) return { props: { patientData: null, error: 'Error: Unable to load patient data.' } };

//     if (!pRecord) return { props: { patientData: null, error: 'Error: Record not found.' } };

//       return {
//         props: {
//           patientData: patientData,
//           pRecord: pRecord,
//         },
//       };
//     } catch (error) {
//     console.error(error);
//     return { props: { error: error.message } };
//   }
// };


export default RecordId;
