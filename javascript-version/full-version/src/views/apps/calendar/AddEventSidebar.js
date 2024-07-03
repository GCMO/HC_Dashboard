/**
 * AddEventSidebar component for managing calendar events.
 *
 */

// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// ** MUI Imports
import {Box, Drawer, Select, Switch, Button, MenuItem, IconButton, TextField, InputLabel, Typography, Tooltip, FormControl, FormHelperText, FormControlLabel, CircularProgress, Autocomplete} from '@mui/material'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** File Imports
import { fetchEvents, addEvent, updateEvent, deleteEvent, fetchServices, } from 'src/store/apps/calendar'; 
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  url: '',
  title: '',
  startDate: new Date(),
  endDate: new Date(),
  allDay: true,
  guests: [],
  description: '',
  calendar: 'Business',
  alert: '1 day',
  repeat: 'never',
  duration: '60min',
}

const AddEventSidebar = props => {
  const { 
    store, 
    dispatch, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    drawerWidth, 
    calendarApi, 
    handleSelectEvent,
    addEventSidebarOpen, 
    handleAddEventSidebarToggle
  } = props
  
  // ** States
  const [values, setValues] = useState(defaultState)
  const services = useSelector(state =>  state.calendar.services || []);
  // console.log("servicesVAR", services);  
  const [selectedService, setSelectedService] = useState(''); // for the Title Selector
  const [loading, setLoading] = useState(false); // for the Spinner


  
  // useForm
  const { control, setValue, clearErrors, handleSubmit, formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
  }

  // Fetch User.Services when component mounts
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  // PAYLOAD
  const onSubmit = async data => {
    setLoading(true); // start loading the spinner

    const modifiedEvent = {
      url: values.url,
      display: 'block',
      title: selectedService, //data.title,
      start: values.startDate,
      end: values.endDate,
      allDay: values.allDay,
      extendedProps: {
        calendar: capitalize(values.calendar),
        guests: values.guests && values.guests.length ? values.guests : undefined,
        description: values.description.length ? values.description : undefined,
        duration: values.duration ? values.duration : '60min',
        repeat: values.event_repeat && values.event_repeat.length ? values.event_repeat : 'never', // Ensure repeat is included
      },
    };

    try {
      if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
        // Create single event in Strapi
        await dispatch(addEvent(modifiedEvent));
      } else {
        // Update existing event
        await dispatch(updateEvent({ id: store.selectedEvent.id, ...modifiedEvent }));
      }
  
      await dispatch(fetchEvents(['Personal', 'Business', 'Family', 'Holiday', 'Event'])); // Fetch events after adding/updating
      calendarApi.refetchEvents();
      handleSidebarClose();
    } finally {
      setLoading(false); // Set loading to false when the operation is complete
    }  
  };

  // DELETE
  const handleDeleteEvent = () => {
    console.log("DELETE_selectedEvent", store.selectedEvent);
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }
    calendarApi.getEventById(store.selectedEvent.id).remove()
    handleSidebarClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent
      setValue('title', event.title || '')
      setValues({
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        // guests: event.extendedProps.guests || [],
        description: event.extendedProps.description || '',
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date(),
        duration: event.extendedProps.duration || '60min',
        repeat: event.extendedProps.repeat || 'never', // ??? event_repeat ???
      });
    }
  }, [setValue, store.selectedEvent])

  // RESET SIDEBAR
  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (store.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const PickersComponent = forwardRef(({ ...props }, ref) => {
    return (
      <TextField inputRef={ref} fullWidth {...props}
        label={props.label || ''} 
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const RenderSidebarFooter = () => {
    if(loading){
      return <CircularProgress/>;
    }

    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      return (
        <Fragment>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
            Add
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
            Update
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={resetToStoredValues}>
            Reset
          </Button>
        </Fragment>
      )
    }
  }

  return (
    <Drawer anchor='right' ModalProps={{ keepMounted: true }}
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box className='sidebar-header'
        sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'background.default',
          p: theme => theme.spacing(3, 3.255, 3, 5.255) }}
      >
        <Typography variant='h6'>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? 'Update Event' : 'Add Event'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? (
            <IconButton size='small'
              sx={{ color: 'text.primary', mr: store.selectedEvent !== null ? 1 : 0 }}
              onClick={handleDeleteEvent}
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          ) : null}
          <IconButton size='small' onClick={handleSidebarClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id="service-select-label"></InputLabel>
                <Autocomplete freeSolo
                  options={services.map((service) => service.title)}
                  value={selectedService}
                  onInputChange={(event, newInputValue) => {
                    setSelectedService(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Title" variant="outlined"
                      value={selectedService}
                      onChange={(event) => setSelectedService(event.target.value)}
                    />
                  )}
                />
              <Typography sx={{ fontSize: 14, fontStyle: 'italic' }}>
                Please create your services in Account Settings =&gt; MyServices. They will be shown here.
              </Typography>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}> 
              <InputLabel id='event-calendar'>Calendar</InputLabel>
              <Select label='Calendar' value={values.calendar} labelId='event-calendar'
                onChange={e => setValues({ ...values, calendar: e.target.value })}
                >
                <MenuItem value='Personal'>Personal</MenuItem>
                <MenuItem value='Business'>Business</MenuItem>
                <MenuItem value='Family'>Family</MenuItem>
                <MenuItem value='Holiday'>Holiday</MenuItem>
                <MenuItem value='Event'>Event</MenuItem>
              </Select>
                <Typography sx={{fontSize:14, fontStyle:'italic',}}>Only the Business option will be shown to customers, other Calendars remain private.</Typography>
            </FormControl>

            <Box sx={{ mb: 6 }}>
              <DatePicker selectsStart id='event-start-date'
                endDate={values.endDate}
                selected={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='Start Date' registername='startDate' />}
                onChange={date => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>
            <Box sx={{ mb: 6 }}>
              <DatePicker selectsEnd id='event-end-date'
                endDate={values.endDate}
                selected={values.endDate}
                minDate={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='End Date' registername='endDate' />}
                onChange={date => setValues({ ...values, endDate: new Date(date) })}
              />
            </Box>
            <FormControl sx={{ mb: 6 }}>
              <FormControlLabel label='All Day' control={
                  <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
                }
              />
            </FormControl>

            {/* <TextField fullWidth type='url' id='event-url' sx={{ mb: 6 }} label='Event URL'
              value={values.url} onChange={e => setValues({ ...values, url: e.target.value })}
            /> */}

            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='event-repeat'>Repeat</InputLabel>
                <Select label='Repeat' value={values.event_repeat || 'never'} labelId='event-repeat' id='event-repeat-select'
                onChange={e => setValues({ ...values, event_repeat: e.target.value })}
                >
                  <MenuItem value='never'>Never</MenuItem>
                  <MenuItem value='daily'>Daily</MenuItem>
                  <MenuItem value='weekly'>Weekly</MenuItem>
                  <MenuItem value='monthly'>Monthly</MenuItem>
                  <MenuItem value='quarterly'>Quaterly</MenuItem>
                  <MenuItem value='yearly'>Yearly</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='event-duration'>Duration</InputLabel>
              <Select label='Duration' value={values.duration} labelId='event-duration' id='event-duration-select' 
              onChange={e => setValues({ ...values, duration: e.target.value })}
              >
                <MenuItem value='15min'>15min</MenuItem>
                <MenuItem value='30min'>30min</MenuItem>
                <MenuItem value='45min'>45min</MenuItem>
                <MenuItem value='60min'>60min</MenuItem>
                <MenuItem value='90min'>90min</MenuItem>
                <MenuItem value='120min'>120min</MenuItem>
                <MenuItem value='180min'>180min</MenuItem>

              </Select>
            </FormControl>

            {/* <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='event-guests'>Guests</InputLabel>
              <Select multiple label='Guests' value={values.guests} labelId='event-guests' id='event-guests-select' 
              onChange={e => setValues({ ...values, guests: e.target.value })}
              >
                <MenuItem value='bruce'>Bruce</MenuItem>
                <MenuItem value='clark'>Clark</MenuItem>
                <MenuItem value='diana'>Diana</MenuItem>
                <MenuItem value='john'>John</MenuItem>
                <MenuItem value='barry'>Barry</MenuItem>
              </Select>
            </FormControl> */}

            <TextField
              rows={4}
              multiline
              fullWidth
              sx={{ mb: 6 }}
              label='Description'
              id='event-description'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}

export default AddEventSidebar
