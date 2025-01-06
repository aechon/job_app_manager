import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '../../redux/job';
import { useEffect } from 'react';
import './JobList.css'; 

const formatPay = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const JobList = () => {
  const jobs = useSelector((state) => state.job.jobs);
  const loading = useSelector((state) => state.job.loading);
  const errors = useSelector((state) => state.job.errors);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors && Object.keys(errors).length > 0) {
    return <div>Error: {errors.server || 'Failed to fetch jobs'}</div>;
  }

  return (
    <div className="job-list-container">
      <h2>Job Listings</h2>
      {jobs.length === 0 ? (
        <p className="centered-message">No jobs found.</p>
      ) : (
        <div className="job-container">
          {jobs
          .sort((a, b) => {
            if (a.name.localeCompare(b.name) > 0) return 1;
            else return -1;
          })
          .map((job) => (
            <div className="job-item" key={job.id}>
              <h3>{job.name}</h3>
              <p>Employer: {job.employer}</p>
              <p>Location: {job.location}</p>
              <p>Pay: ${formatPay(job.pay)}</p> 
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;