const SET_JOB_DETAILS = 'SET_JOB_DETAILS';
const SET_JOB_ERRORS = 'SET_JOB_ERRORS';
const CLEAR_JOB_DETAILS = 'CLEAR_JOB_DETAILS';

// Action Creators
const setJobDetails = (job) => ({
  type: SET_JOB_DETAILS,
  job,
});

const setJobErrors = (errors) => ({
  type: SET_JOB_ERRORS,
  errors,
});

export const clearJobDetails = () => ({
    type: CLEAR_JOB_DETAILS,
  });

// Thunk Action Creators
export const fetchJobDetails = (jobId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const job = await response.json();
      dispatch(setJobDetails(job));
    } else {
      const errorData = await response.json();
      dispatch(setJobErrors(errorData));
    }
  } catch (error) {
    console.error('Error fetching job details:', error);
    dispatch(setJobErrors({ server: 'An unexpected error occurred.' }));
  }
};

// Initial State
const initialState = {
  jobDetails: null,
  errors: {},
};

// Reducer
const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_JOB_DETAILS:
      return {
        ...state,
        jobDetails: action.job,
        errors: {},
      };
    case SET_JOB_ERRORS:
      return {
        ...state,
        errors: action.errors,
      };
    case CLEAR_JOB_DETAILS:
      return {
        ...state,
        jobDetails: null,
        errors: {},
      };
    default:
      return state;
  }
};

export default jobReducer;