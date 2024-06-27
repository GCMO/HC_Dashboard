/**
 * @file FILEPATH: /Users/Pro2015/Downloads/materio-mui-react-nextjs-admin-template-standard-v2.2.0/javascript-version/full-version/src/store/apps/calendar/index.js
 * @brief REDUX TOOLKIT to manage the state of the calendar. Mostly CRUD actions.
 *
 * @description
 * This file contains the Redux implementation for managing the state of the calendar application. It includes actions for CRUD operations on calendar events, data fetching and updating, UI interactions, and state management.
 *
 * @summary
 * The file exports action creators and a reducer used in the Redux store.
 */
// InBrief: REDUX TOOLKIT to manage the state of the calendar. Mostly CRUD actions + event_repeat 

// State Management: Maintaining state for the calendar application including the events, the selected event, and the selected calendars.
// Data Fetching and Updating: Defining async actions (fetchEvents, addEvent, updateEvent, deleteEvent) to interact with backend "CRUDing" calendar events.
// UI Interactions: Handling user actions: selecting a specific event (handleSelectEvent), updating the selected calendars (handleCalendarsUpdate), and toggling the display of all calendars (handleAllCalendars).
// Updating the State based on Actions: Updating the state in response to actions, both if triggered by user actions or completed async operations.
// Exporting Actions & Reducer: Exporting action creators and the reducer used in the Redux store.


// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Libraries Imports
import axios from 'axios'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { addMonths, format } from 'date-fns';
import { identifier } from 'stylis';

// ** Import Files
import generateEventInstances from 'src/@core/utils/eventGenerator';


const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL
const jwtToken = Cookies.get('jwt'); 
console.log('JWT', jwtToken)


// REFACTOR AXIOS to have the headers automated for all requets
//** FETCH EVENTS
 export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async calendars => {
   const response = await axios.get(`${strapiUrl}/users/me?populate=calendars`, { 
    headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    }})
  console.log("EVENTdata", response.data.calendars)

  // Map the fetched data from Strapi TO THE COMPONENT Structure
  const events = response.data.calendars.map(event => ({
    id: event.id,
    title: event.event_title,
    start: event.event_start,
    end: event.event_end,
    allDay: event.event_allDay,
    url: '',
    extendedProps: {
      calendar: event.event_calendar,
      alert: event.event_alert,
      event_repeat: event.event_repeat,
      description: event.event_description,
      location: event.event_location,
      duration: event.event_duration,
    },
    // Add FullCalendar rrule for repeating events
    rrule: event.event_repeat !== 'never' ? {
      freq: event.event_repeat.toLowerCase(),
      dtstart: event.event_start
    } : undefined
  }));

return events; 
});



// ** ADD EVENT - POST
export const addEvent = createAsyncThunk('appCalendar/addEvent', async (event, { dispatch }) => {
  const idDecoder = jwt_decode(jwtToken);   // decode id from JWT   

  console.log('USERID', idDecoder.id);
  const UserId = idDecoder.id;

  const strapiEvent = {
    event_title: event.title,
    event_start: event.start,
    event_end: event.end,
    event_allDay: event.allDay,
    event_calendar: event.extendedProps.calendar,
    event_alert: event.extendedProps.alert,
    event_repeat: 'never',
    event_description: event.extendedProps.description,
    event_location: event.extendedProps.location,
    event_duration: event.extendedProps.duration,
    user: UserId
  };

  const response = await axios.post(`${strapiUrl}/calendars`, {
      data: strapiEvent
    },
    { headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    }},
  );

  const newEvent = response.data.event;

  if (newEvent.event_repeat !== 'never') {
    const instances = generateEventInstances(newEvent, newEvent.event_repeat);
    for (const instance of instances) { // repeatendly post 
      await axios.post(`${strapiUrl}/calendars`, {
        data: {... instance,
          event_repeat: 'never', // ensure each instance doesnt repeat
          user: UserId,
        }}, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        }},
      );
    }
  }

  await dispatch(fetchEvents(['Personal', 'Business', 'Family', 'Holiday', 'Event']));
  
  return newEvent;
  console.log("POSTdata", newEvent)
})

// ** UPDATE EVENT
export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async (event, { dispatch }) => {
  const idDecoder = jwt_decode(jwtToken);
  const userId = idDecoder.id;

  // console.log('USERID', userId);
  const eventId = event.id
  console.log("eventUPDATEid", event.id);

  const strapiUpdateEvent = {
    event_title: event.title || event.event_title ,
    event_start: event.start || event.event_start,
    event_end: event.end || event.event_end,
    event_allDay: event.allDay || event.event_allDay,
    event_calendar: event.extendedProps.calendar ,
    event_alert: event.extendedProps.alert || event.event_alert,
    event_repeat: event.extendedProps.repeat || event.event_repeat,
    event_description: event.extendedProps.description || event.event_description,
    event_location: event.extendedProps.location || event.event_location,
    event_duration: event.extendedProps.duration || event.event_duration,
    users_permissions_user: userId

    // users_permissions_user: event.extendedProps.users_permissions_user
  }

  await axios.put(`${strapiUrl}/calendars/${eventId}`, {
      data: strapiUpdateEvent
    }, { 
      method: 'PUT',
      headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    }},
  );

  if (event.extendedProps.event_repeat !== 'never') {
    const instances = generateEventInstances(event, event.extendedProps.event_repeat);
    for ( const instance of instances) {
      await axios.post(`${strapiUrl}/calendars`, {
        data: { ...instance,
          event_repeat: 'never',
          user: userId,
        }},{
        headers:{
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        }}
      );
    }
  }

  await dispatch(fetchEvents(['Personal', 'Business', 'Family', 'Holiday', 'Event']))
  
  console.log("PUTdata", response.data.calendars)

  return event // response.data.event
});

// To ensure periodic auto-generation of events. Checks the events in the store and generates instances if the latest instance is less than a month from now
const generateMissingInstances = async () => {
  const state = getState().calendar;
  const allEvents = state.events;
  const now = new Date();

  for (const event of allEvents) {
    if (event.extendedProps.event_repeat !== 'never') {
      const latestInstance = new Date(Math.max(...allEvents.filter(e => e.title === event.title).map(e => new Date(e.start))));
      if (latestInstance < addMonths(now, 1)) {
        const instances = generateEventInstances(event, event.extendedProps.event_repeat, latestInstance);
        for (const instance of instances) {
          await axios.post(`${strapiUrl}/calendars`, {
            data: {
              ...instance,
              event_repeat: 'never',
              user: event.user,
            }}, {
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            }},
          );
        }
      }
    }
  }
};

// this function runs daily to ensure events are always generated for the next three months.
setInterval(generateMissingInstances, 24 * 60 * 60 * 1000); // Run daily



// ** DELETE EVENT
export const deleteEvent = createAsyncThunk('appCalendar/deleteEvent', async (id, { dispatch }) => {

  console.log("idDelete", identifier)

  await axios.delete(`${strapiUrl}/calendars/${id}`, { 
    // data: {id : event.id},
    headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    }},
  )

  await dispatch(fetchEvents(['Personal', 'Business', 'Family', 'Holiday', 'Event']))

  return id; // return response.data.event
})
 
// ** Reducer for the Calendars
export const appCalendarSlice = createSlice({
  name: 'appCalendar',
  initialState: {
    events: [],
    selectedEvent: null,
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'Event']
  },
  reducers: {
    handleSelectEvent: (state, action) => {  
      state.selectedEvent = action.payload
   },
    handleCalendarsUpdate: (state, action) => {
      const filterIndex = state.selectedCalendars.findIndex(i => i === action.payload)
      if (state.selectedCalendars.includes(action.payload)) {
        state.selectedCalendars.splice(filterIndex, 1)
      } else {
        state.selectedCalendars.push(action.payload)
      }
      if (state.selectedCalendars.length === 0) {
        state.events.length = 0
      }
    },
    handleAllCalendars: (state, action) => {
      const value = action.payload
      if (value === true) {
        state.selectedCalendars = ['Personal', 'Business', 'Family', 'Holiday', 'Event']
      } else {
        state.selectedCalendars = []
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.events = action.payload
    })
  }
})

export const { handleSelectEvent, handleCalendarsUpdate, handleAllCalendars } = appCalendarSlice.actions

export default appCalendarSlice.reducer


