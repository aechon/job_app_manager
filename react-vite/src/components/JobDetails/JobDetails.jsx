import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobDetails, clearJobDetails } from '../../redux/job';
import { useParams } from 'react-router-dom';
import './JobDetails.css';
import JobForm from '../FormModal/JobForm';
import NewEventModal from '../EventModal/NewEventModal'; 

const JobDetails = () => {
  const { jobId } = useParams(); 
  const dispatch = useDispatch();

  const { jobDetails, loading, error } = useSelector((state) => state.job);
  const [showNewEventModal, setShowNewEventModal] = useState(false); 

  useEffect(() => {
    dispatch(fetchJobDetails(jobId));

    return () => {
      dispatch(clearJobDetails());
    };
  }, [dispatch, jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message || 'Failed to load job details.'}</div>;
  }

  if (!jobDetails) {
    return <div>No job details found.</div>;
  }

  return (
    <div className="job-details-container">
      <div className="job-details-and-form">
        <div className="job-details">
          <h1>Job Details</h1>
          <p><strong>Job ID:</strong> {jobDetails.id}</p>
          <p><strong>Job Name:</strong> {jobDetails.name}</p>
          <p><strong>Employer:</strong> {jobDetails.employer}</p>
          <p><strong>Location:</strong> {jobDetails.location}</p>
          <p><strong>Pay:</strong> ${jobDetails.pay}</p>
          <p><strong>Creator ID:</strong> {jobDetails.creatorId}</p>
        </div>

        <div className="job-form-section">
          <JobForm />
        </div>
      </div>

      <div className="contacts-events-container">
        <div className="contacts-section">
          <h2>Contacts</h2>
          {jobDetails.Contacts && jobDetails.Contacts.length > 0 ? (
            <ul>
              {jobDetails.Contacts.map((contact, index) => (
                <li key={index}>
                  {contact.name} - {contact.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No contacts available.</p>
          )}
        </div>

<div className="events-section">
  <h2>Events</h2>
  {jobDetails.Events && jobDetails.Events.length > 0 ? (
    <ul>
      {jobDetails.Events.map((event) => (
        <li key={event.id}>
          {event.type} with {event.interviewer} - {new Date(event.start).toLocaleString()}
        </li>
      ))}
    </ul>
  ) : (
    <p>No events available.</p>
  )}
  <button onClick={() => setShowNewEventModal(true)}>Schedule New Interview</button>
  
</div>
      </div>

      {showNewEventModal && ( 
        <NewEventModal jobId={jobId} />
      )}
    </div>
  );
};

export default JobDetails;