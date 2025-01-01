import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jobReducer from '../../redux/job';  

const JobDetails = () => {
  const dispatch = useDispatch();

  const { jobs, loading, error } = useSelector((state) => state);

  useEffect(() => {
    dispatch(jobReducer());
  }, [dispatch]);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  console.log("one");
  return (
    <div className="job-details">
      <h2>Job Details Page</h2>
      {!jobs ? (
        <p>No jobs available.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="job-item">
              <h3>{job.name}</h3>
              <p>Location: {job.location}</p>
              <p>Employer: {job.employer}</p>
              <p>Pay: {job.pay}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobDetails;