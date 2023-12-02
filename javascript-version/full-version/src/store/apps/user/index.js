// ** Libraries Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

// setup JWT
const jwtToken = Cookies.get('jwt');         console.log('JWT', jwtToken)

// setup strapi keys
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL


// ** FETCH PATIENTS - GET
export const fetchData = createAsyncThunk('appUsers/fetchData', async ({ userId, q='', role, status, currentPlan } = {} ) => {
  const idDecoder = jwt_decode(jwtToken);
  console.log('PatientID', idDecoder.id);
  // const UserId = idDecoder.id;
  // console.log("userID", UserId)

  // const { q = '', role = null, status = null, currentPlan = null } = config.params ?? ''
  const query = {
    ...(q && { 'filters[fullName][$containsi]': q }), 
    ...(role && { 'filters[role][$eq]': role }),
    ...(status && { 'filters[status][$eq]': status }),
    ...(currentPlan && { 'filters[currentPlan][$eq]': currentPlan }),
    // ...(UserId && {'filters[user][id][$eq]': UserId }),
  };
//
  const response = await axios.get(`${strapiUrl}/users/me?populate=patients`, { 
    headers:{
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    params: query
  })
  console.log("P_userID", query.UserId)

  console.log("PATIENTdata", response.data)

  const patients = response.data.patients.map(patient => ({
    id: patient.id || '',
    fullName: patient.patient_fullName || '', 
    email: patient.patient_email || '',
    countryCode: patient.patiente_countryCode || '',
    contact: patient.patient_contact || '',
    address: patient.patient_address || '',
    city: patient.patient_city || '',
    country: patient.patient_country || '',
    role: patient.patient_role || '',
    status: patient.patient_status || '',
    company: patient.patient_company || '',
    SSN: patient.patient_SSN || '',
    records: patient.patient_records || '',
    user: patient.users_permissions_user || '',
    avatar: '/images/avatars/3.png',
  }));
  console.log("PATIENTmapped", patients)

  // dispatch(fetchData({ role, status, q: value, currentPlan: plan }));

  return {users: patients};
})

// ** ADD PATIENT - POST
export const addUser = createAsyncThunk('appUsers/addUser', async (data, { getState, dispatch }) => {
  const idDecoder = jwt_decode(jwtToken);
  console.log('PatientID', idDecoder.id);
  const UserId = idDecoder.id;

  const patientPayload = {
    data: {
      id: data.it,
        patient_fullName: data.fullName ,
        patient_email: data.email,
        patient_countryCode: data.countryCode || '',
        patient_contact: data.contact || '',
        patient_address: data.address || '',
        patient_city: data.city || '',
        patient_country: data.country || '',
        patient_company: data.company || '',
        patient_SSN: data.patient_SSN || '',
        patient_role: data.role || '',
        patient_status: data.status || '',
        users_permissions_user: UserId,
    }
  };

  try{
    const response = await axios.post(`${strapiUrl}/patients`, patientPayload,
    { headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
      }},
    )
    console.log("ADDPATIENT", response.data)

    const newPatient = {
      id: response.data.data.id,
      ...data,
      avatar: 'images/avatars/1.png',
      avatarColor: 'secondary',
      users_permissions_user: UserId,
    }
    console.log("New Patient Data", newPatient);

    dispatch(fetchData(getState().user.params));

    return {users: newPatient};
    
  }  catch (error) {
    console.error('addUser Error', error);
  }
});

// ** DELETE PATIENT - DELETE
export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { getState, dispatch }) => {
  const response = await axios.delete(`${strapiUrl}/patients/${id}`, {
    data: {id:  id},
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
  }},
  )
  
  dispatch(fetchData(getState().user.params))

  return response.data
});

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer



