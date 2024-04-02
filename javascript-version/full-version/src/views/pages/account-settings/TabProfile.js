/* eslint-disable padding-line-between-statements */
/* eslint-disable react/jsx-newline */
// ** React Imports
import { useState, Fragment } from 'react';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

// ** MUI Imports
import {Grid, Alert, Snackbar, Select, Button, MenuItem, TextField, InputLabel,  CardContent, CardHeader, FormControl, OutlinedInput} from '@mui/material';

// ** Hooks
import useFetch from 'src/hooks/useFetch';
import { useSettings } from 'src/@core/hooks/useSettings';


const TabProfile = () => {

  const jwtToken = Cookies.get('jwt');
  
  // ** TabState
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [profileData, setProfileData] = useState ({
    summary: undefined ,
    title:undefined,
    eduInstitute: undefined,
    eduTitle: undefined,
    otherCert: undefined,
    trainings: undefined,
    specialization: undefined,
    yoe: undefined,
    howitworks: undefined,
    firsttreatment:undefined,
    languages: [], // try with undefined
  });
   
   // **Snackbar Hooks
   const { settings } = useSettings()
   const { skin } = settings
   const handleCloseSnackBtn = (event, reason) => {
     if (reason === 'clickaway') {
       return
     }
     setOpenSnackbar(false)
   }

  //FETCH DATA FROM STRAPI
  const { loading, error, data } = useFetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/me?populate=*`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (loading) return <p className="mx-15 text-3xl">LOADING...</p>
  if (error) return <p className="ml-20 text-3xl">Hollllly 🐄... Something went Wrong. Try reloading the page </p>
  console.log("PROFILE", data);
  console.log("JWT", jwtToken);

  // decode the User Id from JWT
  const idDecoder = jwt_decode(jwtToken || undefined);
  console.log("ID", idDecoder);
  const id = idDecoder.id;

  // SAVE CHANGES BTN
  const saveChangesBtn = async () => {
    try {
     
    const updatedProfileData = {
      summary: profileData.summary,
      title: profileData.title,
      eduInstitute: profileData.eduInstitute,
      eduTitle: profileData.eduTitle,
      otherCert: profileData.otherCert,
      trainings: profileData.trainings,
      specialization: profileData.specialization,
      yoe: profileData.yoe,
      howitworks: profileData.howitworks,
      firsttreatment: profileData.firsttreatment,
      languages: profileData.languages.join(', '),
    };

    console.log('1-profileDataUPDATES ', updatedProfileData);
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedProfileData), // Assuming profile data is nested under 'profile'
      });
      
      if (response.ok) {
        console.log('2-Changes saved successfully', updatedProfileData);
        setOpenSnackbar(true)
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
      summary:undefined,
      title:undefined,
      eduInstitute: undefined,
      eduTitle: undefined,
      otherCert: undefined,
      trainings: undefined,
      specialization: undefined,
      yoe: 0,
      howitworks: undefined,
      firsttreatment:undefined,
      languages: [],
    }
    setProfileData(resetData); 
  }


  return (
    <CardContent>

      <CardHeader title='Profile Overview' sx={{marginLeft: -5, }} />

      <form>

        <Grid container spacing={7}>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel required>Title</InputLabel>
              <Select
                label='Job Title'
                value = { profileData.title || data.title }
                renderValue={(selected) => selected}
                onChange = {(e) => { 
                  const selectedTitle = e.target.value;
                  setProfileData((prevUserData) => ({ ...prevUserData, title: selectedTitle, }));
                }}
              >
                {jobTitle.map((title) => (
                <MenuItem key={title} value={title}> 
                  {title}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField required fullWidth 
            label='Institute of Education' placeholder='Naprapathogskolan' 
            value={profileData.eduInstitute || data.eduInstitute} 
            onChange={(e) => setProfileData({ ...profileData, eduInstitute: e.target.value})}/>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField required fullWidth 
            label='Certificate of Education' placeholder='Naprapat National Education Certification' 
            value={profileData.eduTitle || data.eduTitle} 
            onChange={(e) => setProfileData({ ...profileData, eduTitle: e.target.value})}/>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField  fullWidth label='Other Certifications' 
            placeholder='Biodynamic Craniosacral Therapy (BCST), Kinesiology Taping Practitioner Certification' 
            value={profileData.otherCert || data.otherCert}  
            onChange={(e) => setProfileData({ ...profileData, otherCert: e.target.value})} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField  fullWidth multiline 
            label='Specializations' placeholder='Use this space to clarify your specializations. Ei: Child birth, Migranes, Sport Inguries, etc.. Try to be concise and use a - (dash) in front of each of your specializations' 
            value={profileData.specialization || data.specialization} 
            onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value})} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField required fullWidth 
            label='Years of Practice' placeholder='10 (please just write a number)' 
            value={profileData.yoe || data.yoe} 
            onChange={(e) => setProfileData({ ...profileData, yoe: e.target.value})}/> 
          </Grid>

          <Grid item xs={12} sx={{ marginTop: 4.8 }}>
            <TextField required fullWidth multiline label='Summary' placeholder='Start with a general introduction about yourself. Something along these lines: _The name’s John Deo. I am an osteopath, I have been practiting for the last X year and I specialize in Sport injuries and rehab_'
              value = {profileData.summary || data.summary}
              onChange = {(e) => setProfileData({...profileData, summary: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField  fullWidth multiline minRows={2} 
            label='Training' placeholder='Use this space to speak about your training, who was/were your mentior/s, for which companies you worked, How long you have been practicing. Try to be concise and professional in your writting.  Customers tend to appreciate details and wont spend much time reading. ' 
            value={profileData.trainings || data.trainings} 
            onChange={(e) => setProfileData({ ...profileData, trainings: e.target.value})} />
          </Grid>


          <Grid item xs={12}>
            <TextField fullWidth multiline label='This is how I work' minRows={2}
              placeholder='Describe how you regularly work. EX.: The treatment is tailored to your needs. The starting point is to get a deeper insight into patterns that have been created through life and that are creating unnecessary suffering for you today. This is the first step to being able to change destructive thought patterns, behaviors and feelings. Focusing on the present, I try to help you break repetitive negative behavioural patterns at the root of the trauma. Together we establish new routines and through the treatments we will remove the trauma.'
              value={profileData.howitworks || data.howitworks} 
              onChange={(e) => setProfileData({ ...profileData, howitworks: e.target.value})}/>
          </Grid>

          <Grid item xs={12}>
            <TextField required fullWidth multiline label='During the First Treatment' minRows={2}
              placeholder='Describe how you will approach the first treatment. EX.: During our first meeting I will ask you multiple questions about your diet, allergies, conditions, medications, daily schedule, habits and family circumstances. I will take your pulse, look at your iris and tongue. Then I will invite you to describe the issues you experience. Finally I will prescribe specific remedies and treatments related to your condition.' 
              value={profileData.firsttreatment || data.firsttreatment} 
              onChange={(e) => setProfileData({ ...profileData, firsttreatment: e.target.value})} />
          </Grid>

          <Grid item xs={12} sm={6}>
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
                  setProfileData((prevProfileData) => ({ ...prevProfileData, languages: selectedLanguage }));
                }}
                >
                {languages.map((language) => (
                <MenuItem key={language} value={language}> 
                  {language}
                </MenuItem>
                ))}

              </Select>
            </FormControl>
          </Grid> 

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
  )
}

export default TabProfile;