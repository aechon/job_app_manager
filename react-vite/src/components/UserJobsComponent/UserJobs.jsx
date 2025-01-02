import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserJobs, deleteJob } from '../../redux/job';

export default function UserJobs() {
  const dispatch = useDispatch();
  const userJobs = useSelector(state => state.jobs.userJobs);

  useEffect(() => {
    dispatch(fetchUserJobs());
  }, [dispatch]);

  const handleDelete = (jobId) => {
    dispatch(deleteJob(jobId));
  };

  return (
    <div>
      <h2>My Jobs</h2>
      <div>
        {userJobs.map(job => (
          <div>
            <h3>{job.name}</h3>
            <p>{job.employer}</p>
            <p>{job.location}</p>
            <p>{job.pay}</p>
            <button
              onClick={() => handleDelete(job.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
