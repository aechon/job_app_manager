const GET_SCHEDULE = 'GET_SCHEDULE';
const SET_EVENT_ERRORS = 'SET_EVENT_ERRORS';

// Action creators
const getUserEvents = schedule => ({
    type: GET_SCHEDULE,
    schedule
});

const setEventErrors = (errors) => ({
    type: SET_EVENT_ERRORS,
    errors,
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

// Initial State
const initialState = {
    schedule: [],
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