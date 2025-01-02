const initialState = {
  jobs: [],
  userJobs: [],
  currentJob: null
};

export default function jobsReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_JOBS':
      return { ...state, jobs: action.jobs };
    case 'SET_USER_JOBS':
      return { ...state, userJobs: action.jobs };
    case 'SET_CURRENT_JOB':
      return { ...state, currentJob: action.job };
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.job] };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job => job.id === action.job.id ? action.job : job)
      };
    case 'REMOVE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.jobId)
      };
    default:
      return state;
  }
}

export const fetchJobs = () => async dispatch => {
  const response = await fetch('/api/jobs/');
  if (response.ok) {
    const jobs = await response.json();
    dispatch({ type: 'SET_JOBS', jobs });
  }
};

export const fetchUserJobs = () => async dispatch => {
  const response = await fetch('/api/jobs/current');
  if (response.ok) {
    const data = await response.json();
    dispatch({ type: 'SET_USER_JOBS', jobs: data.Jobs });
  }
};

export const createJob = (jobData) => async dispatch => {
  const response = await fetch('/api/jobs/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });
  if (response.ok) {
    const job = await response.json();
    dispatch({ type: 'ADD_JOB', job });
    return job;
  }
};

export const updateJob = (jobId, jobData) => async dispatch => {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });
  if (response.ok) {
    const job = await response.json();
    dispatch({ type: 'UPDATE_JOB', job });
    return job;
  }
};

export const deleteJob = (jobId) => async dispatch => {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    dispatch({ type: 'REMOVE_JOB', jobId });
  }
};