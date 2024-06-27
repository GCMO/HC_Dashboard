// ** React Import
import { useEffect, useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'
import rrulePlugin from '@fullcalendar/rrule';

// ** Third Party Style Import
import 'bootstrap-icons/font/bootstrap-icons.css'

const blankEvent = {
  id: '',
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    alert: [],
    repeat: [],
    location: '',
    description: '',
    duration: ''
  }
}

const Calendar = props => {
  // ** Props
  const {
    store,
    dispatch,
    direction,
    updateEvent,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle
  } = props

  // ** Refs
  const calendarRef = useRef()
  
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current?.getApi())
    }
  }, [calendarApi, setCalendarApi])

  useEffect(() => {
    if (calendarApi) {
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(store.events.map(event => {
        const repeatFreq = event.extendedProps.repeat || 'never';
        if (repeatFreq !== 'never') {
          return { ...event, rrule: {
            freq: repeatFreq.toLowerCase(),
            dtstart: event.start,
          }}
        }
        return event
      })); 
    }
  }, [store.events, calendarApi]); 

  // ** calendarOptions(Props)
  if (store) {
    const calendarOptions = {
      // events: store.events.map(event => {
      //   console.log("STOREDATA", store.events);
      //   if (event.extendedProps.event_repeat !== 'never') {
      //     return { ...event, rrule: {
      //       freq: event.extendedProps.event_repeat.toLowerCase(),
      //       dtstart: event.start,
      //     }}
      //   }
      //   return event
      // }),
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin, rrulePlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      views: {
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
      },

      /* Enable dragging and resizing event -- Docs: https://fullcalendar.io/docs/editable */
      editable: true,

      /* Enable resizing event from start -- Docs: https://fullcalendar.io/docs/eventResizableFromStart */
      eventResizableFromStart: true,

      /* Automatically scroll the scroll-containers during event drag-and-drop and date selecting -- Docs: https://fullcalendar.io/docs/dragScroll */
      dragScroll: true,

      /* Max number of events within a given day -- Docs: https://fullcalendar.io/docs/dayMaxEvents */
      dayMaxEvents: 48,

      /* Determines if day names and week names are clickable -- Docs: https://fullcalendar.io/docs/navLinks */
      navLinks: true,

      eventClassNames({ event: calendarEvent }) {
        // @ts-ignore
        const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
        return [ `bg-${colorName}` ]
      },

      eventClick({ event: clickedEvent }) {
        dispatch(handleSelectEvent(clickedEvent))
        handleAddEventSidebarToggle()

        // * Only grab required field otherwise it goes in infinity loop
        // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
        // event.value = grabEventDataFromEventApi(clickedEvent)
        // isAddNewEventSidebarActive.value = true
      },

      customButtons: {
        sidebarToggle: {
          icon: 'bi bi-list',
          click() {
            handleLeftSidebarToggle()
          }
        }
      },

      dateClick(info) {
        const ev = { ...blankEvent }
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true
        // @ts-ignore
        dispatch(handleSelectEvent(ev))
        handleAddEventSidebarToggle()
      },

      /* Handle event drop (Also include dragged event) Docs: https://fullcalendar.io/docs/eventDrop
         We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event */
      eventDrop({ event: droppedEvent }) {
        dispatch(updateEvent(droppedEvent))
      },

      /*  Handle event resize -- Docs: https://fullcalendar.io/docs/eventResize  */
      eventResize({ event: resizedEvent }) {
        dispatch(updateEvent(resizedEvent))
      },
      ref: calendarRef,
      direction    // Get direction from app state (store)
    }
    
    // @ts-ignore
    return <FullCalendar {...calendarOptions} />
  } else {
    return null
  }
}

export default Calendar
