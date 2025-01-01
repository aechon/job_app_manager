// Action Types
const FETCH_JOBS_REQUEST = 'job/fetchJobsRequest';

// Action Creators
const fetchJobsRequest = () => ({
  type: FETCH_JOBS_REQUEST
});

export const thunkFetchJobs = () => async (dispatch) => {
  const response = await fetch("/api/jobs/jobs"); 
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }
    
    dispatch(fetchJobsRequest());   
  }
};


const initialState = { jobs: null };

// Reducer
function jobReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_JOBS_REQUEST:
      return { ...state, jobs: action.payload };
    default:
      return state;
  }
}

export default jobReducer;