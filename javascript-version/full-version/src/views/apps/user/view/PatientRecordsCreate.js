import dynamic from 'next/dynamic';
import { useState, Fragment, forwardRef } from 'react';
import { useRouter } from 'next/router';

//** 3rd Party Imports 
import DatePicker from 'react-datepicker'
import Cookies from 'js-cookie';
// import jwt_decode from 'jwt-decode';

// ** MUI imports
import {Button, Divider, Box, TextField, Typography, Grid, CardContent, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, OutlinedInput} from '@mui/material';

// ** File Imports
import { useSettings } from 'src/@core/hooks/useSettings';
import useFetch from 'src/hooks/useFetch'

// ** Styled Components
import DatePickerWrapper from 'src/views/components/react-datepicker'

// ** wysiwyg CSS compiler
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import Close from 'mdi-material-ui/Close';


// Load the Editor component dynamically and avoid SSR
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
  );
  
const saveRecordBtn = () => {
    console.log()
  }
  
const CustomInput = forwardRef((props, ref) => {
    return <TextField required fullWidth inputRef={ref} label='Date of Visit' {...props} />
  })

const createPatientRecords = () => {
  //** fetch ID of patient & lock it into the initialPatientRecord
  const router = useRouter();
  const {patientId} = router.query;
  const initialPatientRecord = {
    id: "",
    record_title: "",
    record_date:new Date() ,
    profession: "",
    lifestyle: "",
    investigation: "",
    diagnosis: "",
    treatmentDetails: "",
    prescription: "",
    homeExercise: "",
    miscellaneous:"",
    medication: "",
    allergies: "",
    patient: {
      id:patientId,
    }
  };

  // ** TabState
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editorState, setEditorState] = useState(); // to hold the editorState
  const [title, setTitle] = useState('');
  const [patientRecordData, setPatientRecordData] = useState(initialPatientRecord)
  
   // **Snackbar Hooks
   const { settings } = useSettings()
   const { skin } = settings
   const handleCloseSnackBtn = (event, reason) => {
     if (reason === 'clickaway') {
       return
     }
     setOpenSnackbar(false)
   }

  const jwtToken = Cookies.get('jwt');

  //FETCH DATA FROM STRAPI 
  const { loading, error, data } = useFetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patient-records?populate=patient`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (loading) return <p className="mx-15 text-3xl">LOADING...</p>
  if (error) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>
  console.log("create_RECORDS", data);
  console.log("JWT", jwtToken);
  

  // SAVE CHANGES BTN
  const saveChangesBtn = async () => {    

    try {
    const updatedPatientRecordData =  {
      // id: patientRecordData?.id,
      record_title: patientRecordData?.record_title ,
      record_date: patientRecordData.attributes?.record_date ? new Date(patientRecordData.record_date) : new Date(),
      profession: patientRecordData?.profession,
      lifestyle: patientRecordData?.lifestyle,
      investigation: patientRecordData?.investigation,
      diagnosis: patientRecordData?.diagnosis,
      treatmentDetails: patientRecordData?.treatmentDetails,
      prescription: patientRecordData?.prescription,
      homeExercise: patientRecordData?.homeExercise,
      miscellaneous: patientRecordData?.miscellaneous,
      medication: patientRecordData?.medication,
      allergies: patientRecordData?.allergies,
      patient: patientRecordData?.patient?.id  
    };

    console.log('1-profileDataUPDATES_ID ', updatedPatientRecordData);
    // console.log('2-profileDataUPDATES_ID ', id);
    
    // ATTEMPT @ MAKING auto detect edit (PUT). 
    // const isExistingRecord = updatedPatientRecordData?.id;
    // const url = isExistingRecord 
    // ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patient-records/${updatedPatientRecordData.id}`
    // : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patient-records`;
    // console.log('3-profileDataUPDATES_ID ', patientRecordData.id);
    // const method = isExistingRecord ? 'PUT' : 'POST';

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/patient-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({data: updatedPatientRecordData}) // Assuming profile data is nested in state
      });
      
      if (response.ok) {
        // const successMessage = isExistingRecord ? 'Changes updated successfully' : 'Record created successfully';
        console.log('Record created successfully', updatedPatientRecordData);
        setOpenSnackbar(true)
        setPatientRecordData(initialPatientRecord)
      } else {
        console.log('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  // RESET DATA TO EMPTY
  const resetBtn = () => {
     const resetData = {
      record_title: "" ,
      record_date: "",
      profession: "",
      lifestyle: "",
      investigation: "",
      diagnosis: "",
      treatmentDetails: "",
      prescription: "",
      homeExercise: "",
      miscellaneous: "",
      medication: "",
      allergies: "",
    }
    setPatientRecordData(resetData); 
  }

  return (
    <>
  <CardContent>
      <form>
        <Grid container spacing={3} sx={{ boxShadow: '2px 2px 15px rgba(0, 0, 0, 0.45)', borderRadius:'7px', paddingRight:'15px', padding:'15px', paddingBottom:'20px' }}>

          <Grid item xs={12} sm={12}>
            <Typography sx={{fontSize:'28px',  paddingBottom:'20px'}}            
              > <b>Patient Record</b> 
            </Typography>
            </Grid>

          <Grid item xs={12} sm={6}>
            <TextField required fullWidth label='Title' placeholder='Record Title' 
            value={'' || patientRecordData.record_title}  
            onChange={(e) => setPatientRecordData({ ...patientRecordData, record_title: e.target.value})} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePickerWrapper >
              <DatePicker
                required
                fullWidth
                selected={data?.date ? new Date(data.date) : (patientRecordData.record_date ? new Date(patientRecordData.record_date) : new Date())}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='YYYY-MM-DD'
                customInput={ <CustomInput/> }
                onChange={(date) =>  {
                  setPatientRecordData((prevPatientRecordData) => ({ ...prevPatientRecordData, date: date, }));
                  }}
                // sx={{width:'10%'}}
                />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12} >
            <TextField fullWidth multiline minRows={2} label='Lifestyle' placeholder='Patient Lifestyle' 
            value={patientRecordData.lifestyle}  
            onChange={(e) => setPatientRecordData({ ...patientRecordData, lifestyle: e.target.value})} />
          </Grid>

          <Grid item xs={12} >
            <TextField fullWidth multiline minRows={2} label='Profession' placeholder='Patient Profession' 
            value={'' ||  patientRecordData.profession} 
            onChange={(e) => setPatientRecordData({ ...patientRecordData, profession: e.target.value})} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth multiline minRows={2} label='Medications'
              placeholder='Medications taken by patient currently'
              value={'' || patientRecordData.medication} onChange={(e) => setPatientRecordData({ ...patientRecordData, medication: e.target.value})}/>
          </Grid>

          <Grid item xs={12} >
            <TextField fullWidth multiline minRows={2} label='Allergies' placeholder='Allergies' 
            value={'' || patientRecordData.allergies} 
            onChange={(e) => setPatientRecordData({ ...patientRecordData, allergies: e.target.value})}/> 
          </Grid>
          
          <Grid item xs={12} >
            <TextField fullWidth multiline minRows={2} label='Investigation' placeholder='Investigation Details' 
            value={'' || patientRecordData.investigation} 
            onChange={(e) => setPatientRecordData({ ...patientRecordData, investigation: e.target.value})}/> 
          </Grid>

          <Grid item xs={12} >
            <TextField fullWidth multiline minRows={2} label='Diagnosis' placeholder='Diagnosis' 
            value={'' || patientRecordData.diagnosis } 
            onChange={(e) => setPatientRecordData({ ...patientRecordData, diagnosis: e.target.value})}/>
          </Grid>
          
          <Grid item xs={12} >
            <TextField fullWidth multiline minRows={2} label='Treatment Details' placeholder='Treatment Details' value={'' || patientRecordData.treatmentDetails} 
            onChange={(e) => setPatientRecordData({ ...patientRecordData, treatmentDetails: e.target.value})}/>
          </Grid>
          
          <Grid item xs={12} >
            <TextField fullWidth multiline minRows={2} label='Prescription' placeholder='Prescription' 
            value = {'' || patientRecordData.prescription} 
            onChange = {(e) => setPatientRecordData({...patientRecordData, prescription: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth multiline minRows={2} label='Exercise' placeholder='Patient Homework Exercises' value={'' || patientRecordData.homeExercise} onChange={(e) => setPatientRecordData({ ...patientRecordData, homeExercise: e.target.value})} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ border: '1px solid silver',  borderRadius: '4px', backgroundColor: 'white',  maxWidth: '100%', p: 2, }} 
            >
            <TextField fullWidth variant="outlined" placeholder="Miscellaneous" sx={{ mb: 2 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
    
            <Editor
              placeholder="Record Details"
              editorState={editorState}
              onEditorStateChange={setEditorState}
              editorStyle={{ backgroundColor: 'white',  maxWidth:'100%', height:'150px', paddingLeft:'10px', border: '1px solid silver', borderRadius: '4px',}}
            />
            </Box>
          </Grid>  
            
          {/* <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-multiple-select-label'>Languages</InputLabel>
              {console.log("LANGUAGES", data.languages)}
              <Select
                multiple
                id='account-settings-multiple-select'
                labelId='account-settings-multiple-select-label'
                input={<OutlinedInput label='Languages' id='select-multiple-language'/>}
                value={[...selectedLanguages]}
                renderValue={(selected) => selected.join(', ')}
                onChange = {(e) => { 
                  const selectedLanguage = e.target.value;
                  setSelectedLanguages(selectedLanguage);
                  setPatientRecordData((prevProfileData) => ({ ...prevProfileData, languages: selectedLanguage }));
                }}
                >
                {languages.map((language) => (
                <MenuItem key={language} value={language}> 
                  {language}
                </MenuItem>
                ))}

              </Select>
            </FormControl>
          </Grid> */}

          <Grid item xs={12}>
            <Fragment>
              <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={saveChangesBtn}>
                Save Changes
              </Button>
              <Snackbar 
                open={openSnackbar} 
                onClose={handleCloseSnackBtn} 
                autoHideDuration={3000}>
                <Alert 
                  variant='filled' 
                  severity='success' 
                  sx={{width:'100%'}}
                  onClose={handleCloseSnackBtn} 
                  elevation={skin === 'bordered' ? 0 : 3}> 
                  Data Succesfully Saved
                </Alert>
              </Snackbar>
            </Fragment>

            <Button type='reset' variant='outlined' color='secondary' onClick={resetBtn}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>

    <Divider sx={{ my: theme => `${theme.spacing(0)} !important` }} />


    {/* <Button color='success' variant='contained' onClick={saveRecordBtn} sx={{marginTop:'15px'}}>
      Save Record
    </Button>
    <Button color='info' variant='contained' onClick={saveRecordBtn} sx={{marginTop:'15px', marginLeft:'15px'}}>
      Print Record
    </Button> */}
    </>
  );
};

export default createPatientRecords;


