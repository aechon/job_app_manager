import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateJob } from '../../redux/job';

export default function UpdateJobForm({ jobId, onClose }) {
  const dispatch = useDispatch();
  const job = useSelector(state => 
    state.jobs.jobs.find(job => job.id === jobId)
  );

  const [jobData, setJobData] = useState({
    name: '',
    employer: '',
    location: '',
    pay: ''
  });

  useEffect(() => {
    if (job) {
      setJobData({
        name: job.name,
        employer: job.employer,
        location: job.location,
        pay: job.pay
      });
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateJob(jobId, jobData));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Job</h2>
      <div>
        <input
          type="text"
          value={jobData.name}
          onChange={e => setJobData({...jobData, name: e.target.value})}
          placeholder="Job Title"
          required
        />
        <input
          type="text"
          value={jobData.employer}
          onChange={e => setJobData({...jobData, employer: e.target.value})}
          placeholder="Employer"
          required
        />
        <input
          type="text"
          value={jobData.location}
          onChange={e => setJobData({...jobData, location: e.target.value})}
          placeholder="Location"
        />
        <input
          type="text"
          value={jobData.pay}
          onChange={e => setJobData({...jobData, pay: e.target.value})}
          placeholder="Pay"
        />
        <div>
          <button 
            type="submit"
          >
            Update
          </button>
          <button 
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}