const SET_JOB_DETAILS = 'SET_JOB_DETAILS';
const SET_JOB_ERRORS = 'SET_JOB_ERRORS';
const CLEAR_JOB_DETAILS = 'CLEAR_JOB_DETAILS';
const FETCH_JOBS_REQUEST = 'FETCH_JOBS_REQUEST';
const FETCH_JOBS_SUCCESS = 'FETCH_JOBS_SUCCESS';
const FETCH_JOBS_FAILURE = 'FETCH_JOBS_FAILURE';
const FETCH_USER_JOBS_REQUEST = 'FETCH_USER_JOBS_REQUEST';
const FETCH_USER_JOBS_SUCCESS = 'FETCH_USER_JOBS_SUCCESS';
const FETCH_USER_JOBS_FAILURE = 'FETCH_USER_JOBS_FAILURE';
const CREATE_JOB_FORM_RELATION = 'CREATE_JOB_FORM_RELATION';
const DELETE_JOB_FORM_RELATION = 'DELETE_JOB_FORM_RELATION';
const CREATE_JOB_CONTACT_RELATION = 'CREATE_JOB_CONTACT_RELATION';
const DELETE_JOB_CONTACT_RELATION = 'DELETE_JOB_CONTACT_RELATION';

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

const createJobFormRelation = () => ({
  type: CREATE_JOB_FORM_RELATION
});

const deleteJobFormRelation = () => ({
  type: DELETE_JOB_FORM_RELATION
});

const createJobContactRelation = () => ({
  type: CREATE_JOB_CONTACT_RELATION
});

const deleteJobContactRelation = () => ({
  type: DELETE_JOB_CONTACT_RELATION
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

// New Action Creators for Fetching User Jobs
const fetchUserJobsRequest = () => ({
  type: FETCH_USER_JOBS_REQUEST,
});

const fetchUserJobsSuccess = (jobs) => ({
  type: FETCH_USER_JOBS_SUCCESS,
  jobs,
});

const fetchUserJobsFailure = (error) => ({
  type: FETCH_USER_JOBS_FAILURE,
  error,
});

//create a new event
export const createEvent = (eventData) => async (dispatch) => {
  try {
    const response = await fetch('/api/schedule/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }

    const updatedJobDetails = await response.json(); // Get updated job details
    dispatch(setJobDetails(updatedJobDetails)); // Update the Redux store with new job details
  } catch (error) {
    console.error('Error creating event:', error);
    dispatch(setJobErrors({ server: error.message })); // Handle errors
  }
};

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

// New Thunk for Fetching User Jobs
export const fetchUserJobs = () => async (dispatch) => {
  dispatch(fetchUserJobsRequest());
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
      },
    });

    if (response.ok) {
      const jobs = await response.json();
      dispatch(fetchUserJobsSuccess(jobs));
    } else {
      const errorData = await response.json();
      dispatch(fetchUserJobsFailure(errorData));
    }
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    dispatch(fetchUserJobsFailure({ server: 'An unexpected error occurred.' }));
  }
};

export const addJobFormRelation = (jobId, formId) => async (dispatch) => {
  const response = await fetch(`/api/jobs/${jobId}/forms/${formId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(createJobFormRelation());
    return null; 
  } else {
    const errorData = await response.json();
    dispatch(setJobErrors(errorData));
    return errorData; 
  }
};

export const addJobContactRelation = (jobId, contactId) => async (dispatch) => {
  const response = await fetch(`/api/jobs/${jobId}/contacts/${contactId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(createJobContactRelation());
    return null; 
  } else {
    const errorData = await response.json();
    dispatch(setJobErrors(errorData));
    return errorData; 
  }
};

export const removeJobFormRelation = (jobId, formId) => async (dispatch) => {
  const response = await fetch(`/api/jobs/${jobId}/forms/${formId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(deleteJobFormRelation());
    return null; 
  } else {
    const errorData = await response.json();
    dispatch(setJobErrors(errorData));
    return errorData; 
  }
};

export const removeJobContactRelation = (jobId, contactId) => async (dispatch) => {
  const response = await fetch(`/api/jobs/${jobId}/contacts/${contactId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(deleteJobContactRelation());
    return null; 
  } else {
    const errorData = await response.json();
    dispatch(setJobErrors(errorData));
    return errorData; 
  }
};

// Initial State
const initialState = {
  jobDetails: null,
  jobs: [], // Holds the list of all jobs
  userJobs: [], // Holds the list of current user's jobs
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
    case FETCH_USER_JOBS_REQUEST:
      return {
        ...state,
        loading: true,
        errors: {},
      };
    case FETCH_USER_JOBS_SUCCESS:
      return {
        ...state,
        loading: false,
        userJobs: action.jobs, // Store the fetched user jobs
      };
    case FETCH_USER_JOBS_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.error,
      };
    case CREATE_JOB_FORM_RELATION:
      return {
        ...state,
      };
    case CREATE_JOB_CONTACT_RELATION:
      return {
        ...state,
      };
    case DELETE_JOB_FORM_RELATION:
      return {
        ...state,
      };
    case DELETE_JOB_FORM_RELATION:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default jobReducer;