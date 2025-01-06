import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '../../redux/job'; 
import { Link } from 'react-router-dom';
import './JobUserList.css'; 

const JobUserList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.job.jobs);
  const loading = useSelector((state) => state.job.loading);
  const errors = useSelector((state) => state.job.errors);

  const [editingJob, setEditingJob] = useState(null);
  const [jobDetails, setJobDetails] = useState({ name: '', employer: '', location: '', pay: '', description: ''});
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [modalMessage, setModalMessage] = useState(''); 





  useEffect(() => {
    dispatch(fetchJobs()); 
  }, [dispatch]);

  const handleEditClick = (job) => {
    setEditingJob(job.id);
    setJobDetails({ name: job.name, employer: job.employer, location: job.location, pay: job.pay, description: job.description });
    setShowEditModal(true); 
  };



  const formatPay = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

  const handleDeleteClick = async (jobId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (response.ok) {
      dispatch(fetchJobs());
    } else {
      const errorData = await response.json();
      if (errorData.message === "Unauthorized to delete this job") {
        setModalMessage('You do not have permission to delete this job.');
        setShowEditModal(true); 
      }
      console.error('Error deleting job:', errorData);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    const response = await fetch(`/api/jobs/${editingJob}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(jobDetails),
    });

    if (response.ok) {
      setEditingJob(null);
      setJobDetails({ name: '', employer: '', location: '', pay: '', description: '' });
      dispatch(fetchJobs());
      setShowEditModal(false); 
    } else {
      const errorData = await response.json();
      if (errorData.message === "Unauthorized to edit this job") {
        setModalMessage('You do not have permission to edit this job.');
        setShowEditModal(true);
      }
      console.error('Error editing job:', errorData);
    }
  };

  const handleCreateJobSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    const response = await fetch('/api/jobs/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(jobDetails),
    });

    if (response.ok) {
      setJobDetails({ name: '', employer: '', location: '', pay: '', description: '' });
      dispatch(fetchJobs());
      setShowCreateModal(false);
    } else {
      const errorData = await response.json();
      setModalMessage(errorData.error || 'Failed to create job');
      console.error('Error creating job:', errorData);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false); 
    setModalMessage(''); 
  };

  const closeCreateModal = () => {
    setShowCreateModal(false); 
    setModalMessage(''); 
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
    setJobDetails({ name: '', employer: '', location: '', pay: '', description: ''});
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors && Object.keys(errors).length > 0) {
    return <div>Error: {errors.server || 'Failed to fetch jobs'}</div>;
  }

  return (
    <div className="job-user-list-container">
      <h2>Your Job Listings</h2>
      <button className="create-job-button" onClick={handleShowCreateModal}>
        Create a New Job
      </button>
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
              <h3>
                <Link to={`/jobs/${job.id}`}>{job.name}</Link>
              </h3>
              <p>Employer: {job.employer}</p>
              <p>Location: {job.location}</p>
              <p>Pay: ${formatPay(job.pay)}</p> 
              <div className="job-buttons">
                <button className="edit-button" onClick={() => handleEditClick(job)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteClick(job.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeEditModal}>&times;</span>
            {modalMessage ? (
              <p>{modalMessage}</p>
            ) : (
              <form onSubmit={handleEditSubmit}>
                <h3>Edit Job</h3>
                <input
                  type="text"
                  value={jobDetails.name}
                  onChange={(e) => setJobDetails({ ...jobDetails, name: e.target.value })}
                  placeholder="Job Name"
                  required
                />
                <input
                  type="text"
                  value={jobDetails.employer}
                  onChange={(e) => setJobDetails({ ...jobDetails, employer: e.target.value })}
                  placeholder="Employer"
                  required
                />
                <input
                  type="text"
                  value={jobDetails.location}
                  onChange={(e) => setJobDetails({ ...jobDetails, location: e.target.value })}
                  placeholder="Location"
                />
                <input
                  type="number"
                  value={jobDetails.pay}
                  onChange={(e) => setJobDetails({ ...jobDetails, pay: e.target.value })}
                  placeholder="Pay"
                />
                <textarea
                  type="text"
                  value={jobDetails.description}
                  onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
                  placeholder="Description"
                />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={closeEditModal}>Cancel</button>
              </form>
            )}
          </div>
        </div>
      )}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeCreateModal}>&times;</span>
            {modalMessage && <p>{modalMessage}</p>}
            <form onSubmit={handleCreateJobSubmit}>
              <h3>Create New Job</h3>
              <input
                type="text"
                value={jobDetails.name}
                onChange={(e) => setJobDetails({ ...jobDetails, name: e.target.value })}
                placeholder="Job Name"
                required
              />
              <input
                type="text"
                value={jobDetails.employer}
                onChange={(e) => setJobDetails({ ...jobDetails, employer: e.target.value })}
                placeholder="Employer"
                required
              />
              <input
                type="text"
                value={jobDetails.location}
                onChange={(e) => setJobDetails({ ...jobDetails, location: e.target.value })}
                placeholder="Location"
              />
              <input
                type="number"
                value={jobDetails.pay}
                onChange={(e) => setJobDetails({ ...jobDetails, pay: e.target.value })}
                placeholder="Pay"
              />
              <textarea
                type="text"
                value={jobDetails.description}
                onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
                placeholder="Description"
              />
              <button type="submit">Create Job</button>
              <button type="button" onClick={closeCreateModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobUserList;