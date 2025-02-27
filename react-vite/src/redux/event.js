const GET_SCHEDULE = 'GET_SCHEDULE';
const SET_EVENT_ERRORS = 'SET_EVENT_ERRORS';
const ADD_EVENT = 'ADD_EVENT';
const UPDATE_EVENT = 'UPDATE_EVENT';
const GET_EVENT_DETAILS = 'GET_EVENT_DETAILS';
const DELETE_EVENT = 'DELETE_EVENT';

// Action creators
const getUserEvents = schedule => ({
  type: GET_SCHEDULE,
  schedule
});

const setEventErrors = (errors) => ({
  type: SET_EVENT_ERRORS,
  errors,
});

const addEvent = (event) => ({
  type: ADD_EVENT,
  event,
});

const updateEvent = (event) => ({
  type: UPDATE_EVENT,
  event,
});

const getEventDetails = (event) => ({
  type: GET_EVENT_DETAILS,
  event,
})

const deleteEvent = (event) => ({
  type: DELETE_EVENT,
  event,
});

// Thunk Action Creators
export const fetchUserSchedule = () => async (dispatch) => {
    try {
        const response = await fetch('/api/schedule/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const schedule = await response.json();
          dispatch(getUserEvents(schedule));
        } else {
          const errorData = await response.json();
          dispatch(setEventErrors(errorData)); 
        }
      } catch (error) {
        console.error('Error fetching user schedule:', error);
        dispatch(setEventErrors({ server: 'An unexpected error occurred.' }));
      }

}

export const createEvent = (eventData) => async (dispatch) => {
  const response = await fetch('/api/schedule/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (response.ok) {
    const newEvent = await response.json();
    dispatch(addEvent(newEvent));
    return null; 
  } else {
    const errorData = await response.json();
    dispatch(setEventErrors(errorData));
    return errorData; 
  }
}

export const editEvent = (eventData, id) => async (dispatch) => {
  const response = await fetch(`/api/schedule/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (response.ok) {
    const updatedEvent = await response.json();
    dispatch(updateEvent(updatedEvent));
    return null; 
  } else {
    const errorData = await response.json();
    dispatch(setEventErrors(errorData));
    return errorData; 
  }
}

export const removeEvent = (id) => async (dispatch) => {
  const response = await fetch(`/api/schedule/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteEvent(id)); 
  } else {
    const errorData = await response.json();
    console.error("Error deleting event:", errorData);

  }
};

export const fetchEventDetails = (id) => async (dispatch) => {
  try {
      const response = await fetch(`/api/schedule/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const event = await response.json();
        dispatch(getEventDetails(event));
      } else {
        const errorData = await response.json();
        dispatch(setEventErrors(errorData)); 
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      dispatch(setEventErrors({ server: 'An unexpected error occurred.' }));
    }

}

// Initial State
const initialState = {
    schedule: [],
    event: {},
    errors: {},
};

// Reducer
const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE:
      return {
        ...state,
        schedule: action.schedule
      };
    case ADD_EVENT:
    return {
      ...state,
      event: action.event
    };
    case UPDATE_EVENT:
    return {
      ...state,
      event: action.event
    };
    case GET_EVENT_DETAILS:
    return {
      ...state,
      event: action.event
    };
    case DELETE_EVENT:
    return {
      ...state,
      event: action.event
    };
    case SET_EVENT_ERRORS:
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export default eventReducer;