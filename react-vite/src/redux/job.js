const SET_JOB_DETAILS = 'SET_JOB_DETAILS';
const SET_JOB_ERRORS = 'SET_JOB_ERRORS';
const CLEAR_JOB_DETAILS = 'CLEAR_JOB_DETAILS';
const FETCH_JOBS_REQUEST = 'FETCH_JOBS_REQUEST';
const FETCH_JOBS_SUCCESS = 'FETCH_JOBS_SUCCESS';
const FETCH_JOBS_FAILURE = 'FETCH_JOBS_FAILURE';

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

// New Action Creators for Fetching Jobs
const fetchJobsRequest = () => ({
  type: FETCH_JOBS_REQUEST,
});

const fetchJobsSuccess = (jobs) => ({
  type: FETCH_JOBS_SUCCESS,
  jobs,
});

const fetchJobsFailure = (error) => ({
  type: FETCH_JOBS_FAILURE,
  error,
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

// New Thunk for Fetching All Jobs
export const fetchJobs = () => async (dispatch) => {
  dispatch(fetchJobsRequest());
  try {
    const response = await fetch('/api/jobs/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const jobs = await response.json();
      dispatch(fetchJobsSuccess(jobs));
    } else {
      const errorData = await response.json();
      dispatch(fetchJobsFailure(errorData));
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    dispatch(fetchJobsFailure({ server: 'An unexpected error occurred.' }));
  }
};

// Initial State
const initialState = {
  jobDetails: null,
  jobs: [], // Add this line to hold the list of jobs
  loading: false, 
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
    case FETCH_JOBS_REQUEST:
      return {
        ...state,
        loading: true,
        errors: {},
      };
    case FETCH_JOBS_SUCCESS: 
      return {
        ...state,
        loading: false,
        jobs: action.jobs,
      };
    case FETCH_JOBS_FAILURE: 
      return {
        ...state,
        loading: false,
        errors: action.error,
      };
    default:
      return state;
  }
};

export default jobReducer;