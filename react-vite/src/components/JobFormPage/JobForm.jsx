import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createJob } from '../../redux/job';

export default function JobForm() {
  const dispatch = useDispatch();
  const [jobData, setJobData] = useState({
    name: '',
    employer: '',
    location: '',
    pay: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createJob(jobData));
    setJobData({ name: '', employer: '', location: '', pay: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Job</h2>
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
        <button 
          type="submit"
        >
          Create Job
        </button>
      </div>
    </form>
  );
}