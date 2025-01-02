import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../redux/job';

export default function JobDetails() {
  const dispatch = useDispatch();
  const jobs = useSelector(state => state.jobs.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div>
      <h2>Jobs</h2>
      <div>
        {jobs.map(job => (
          <div>
            <h3>{job.name}</h3>
            <p>{job.employer}</p>
            <p>{job.location}</p>
            <p>{job.pay}</p>
          </div>
        ))}
      </div>
    </div>
  );
}