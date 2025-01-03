const ADD_JOB = 'ADD_JOB';
const SET_JOB_ERRORS = 'SET_JOB_ERRORS';
const SET_USER_JOBS = 'SET_USER_JOBS';
const DELETE_JOB = 'DELETE_JOB';
const UPDATE_JOB = 'UPDATE_JOB';

// Action Creators
const addJob = (job) => ({
  type: ADD_JOB,
  job,
});

const setJobErrors = (errors) => ({
  type: SET_JOB_ERRORS,
  errors,
});

const setUserJobs = (jobs) => ({
  type: SET_USER_JOBS,
  jobs,
});

const deleteJobSuccess = (jobId) => ({
  type: DELETE_JOB,
  jobId,
});

const updateJob = (updatedJob) => ({
  type: UPDATE_JOB,
  updatedJob,
});

//Thunk Action Creators
export const fetchJobs = () => async dispatch => {
    try {
      const response = await fetch('/api/jobs/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      if (response.ok) {
        const jobs = await response.json();
        dispatch(setUserJobs(jobs));
      } else {
        const errorData = await response.json();
        dispatch(setJobErrors(errorData));
      }
    } catch (error) {
      console.error('Error fetching job forms:', error);
      dispatch(setJobErrors({ server: 'An unexpected error occured.' }));
    }
};

export const fetchUserJobs = () => async dispatch => {
  try {
    const response = await fetch('/api/jobs/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (response.ok) {
      const jobs = await response.json();
      dispatch(setUserJobs(jobs));
    } else {
      const errorData = await response.json();
      dispatch(setJobErrors(errorData));
    }
  } catch (error) {
    console.error('Error fetching job forms:', error);
    dispatch(setJobErrors({ server: 'An unexpected error occured.' }));
  }
};


export const createJob = (jobData) => async dispatch => {
  const response = await fetch('/api/jobs/new', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(jobData)
  });

  if (response.ok) {
    const newJob = await response.json();
    dispatch(addJob(newJob));
    dispatch(fetchUserJobs());
    return null;
  } else {
    const errorData = await response.json();
    dispatch(setJobErrors(errorData));
    return errorData;
  }
};

export const deleteJob = (jobId) => async dispatch => {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteJobSuccess(jobId));
  } else {
    const errorData = await response.json();
    console.error("Error deleting form:", errorData);
  }
};

export const editJob = (jobData) => async dispatch => {
  try {
    const response = await fetch(`/api/jobs/${jobData.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(jobData)
    });

    if (response.ok) {
      const updatedJob = await response.json();
      dispatch(updateJob(updatedJob));
    } else {
      const errorData = await response.json();
      dispatch(setJobErrors(errorData));
    }
  } catch (error) {
    console.error('Error fetching job forms:', error);
    dispatch(setJobErrors({ server: 'An unexpected error occured.' }));
  }
};

//Initial State
const initialState = {
  jobs: [],
  userJobs: [],
  errors: {},
};

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_JOB:
      return { 
        ...state, 
        jobs: [...state.jobs, action.job],
        userJobs: [...state.userJobs, action.job],
        errors: {},
      };
    case SET_USER_JOBS:
        return { 
          ...state, 
          userJobs: action.jobs 
        };
    case DELETE_JOB:
      return {
        ...state,
        userJobs: state.userJobs.filter(job => job.id !== action.jobId)
      };
    case UPDATE_JOB:
     return {
       ...state,
       userJobs: state.userJobs.map(job => job.id === action.updateJob.id ? action.updateJob : job)
     };
     case SET_JOB_ERRORS:
      return {
        ...state,
        errors: action.errors,
      }; 
    default:
      return state;
  }
};

export default jobsReducer;