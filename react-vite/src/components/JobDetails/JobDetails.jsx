import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobDetails, clearJobDetails, removeJobContactRelation } from '../../redux/job';
import { useParams } from 'react-router-dom';
import './JobDetails.css';
import JobForm from '../FormModal/JobForm';
import { NewEventModal, EventDetailModal } from '../EventModal';
import { ContactListModal } from '../RelationModal';
import { useModal } from "../../context/Modal";
import dayjs from 'dayjs';

const JobDetails = () => {
  const { jobId } = useParams(); 
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const { jobDetails, loading, error } = useSelector((state) => state.job);
  const [ contactError, setContactError] = useState('');

  useEffect(() => {
    dispatch(fetchJobDetails(jobId));

    return () => {
      dispatch(clearJobDetails());
    };
  }, [dispatch, jobId]);

  const handleRemoveContact = async (contactId) => {
    // Dispatch the delete action
    const serverResponse = await dispatch(removeJobContactRelation(jobId, contactId));
    
    if (serverResponse) {
      // If there's an error from the server, set the errors
      setContactError(serverResponse.message);
    } else {
      dispatch(fetchJobDetails(jobId)); // Fetch updated job details <=================
    }
  }

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
          {/* <p><strong>Job ID:</strong> {jobDetails.id}</p> */}
          <p><strong>Job Name:</strong> {jobDetails.name}</p>
          <p><strong>Employer:</strong> {jobDetails.employer}</p>
          <p><strong>Location:</strong> {jobDetails.location}</p>
          <p><strong>Pay:</strong> ${jobDetails.pay}</p>
          {/* <p><strong>Creator ID:</strong> {jobDetails.creatorId}</p> */}
        </div>

        <div className="job-form-section">
          <JobForm />
        </div>
      </div>
      
      <div className="contacts-events-container">
        <div className="contacts-section">
          <h2>Contacts</h2>
          {contactError && <p className="error-message">{contactError}</p>}
          <div className="contacts-list">
            {jobDetails.Contacts && jobDetails.Contacts.length > 0 ? (
              <ul>
                {jobDetails.Contacts.map((contact, index) => (
                  <li className='contact-list-item' key={index}>
                    {contact.name} 
                    {contact.email != '' ? (
                      <>
                        {' - ' + contact.email}
                      </>
                    ):(
                      <></>
                    )}
                    <button className='contact-remove-button' onClick={() => handleRemoveContact(contact.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No contacts available.</p>
            )}
          </div>
          <button className="add-contact-button" onClick={() => setModalContent(<ContactListModal jobId={jobId} />)}>
            Select Contact
          </button>
        </div>

        <div className="events-section">
          <h2>Events</h2>
          <div className="events-list">
            {jobDetails.Events && jobDetails.Events.length > 0 ? (
              <ul>
                {jobDetails.Events.map((event) => (
                  <li 
                    key={event.id} 
                    className="event-item" 
                    onClick={() => setModalContent(<EventDetailModal eventId={event.id} />)}
                  >
                    <span className="event-name">{event.type}
                    {event.interviewer != '' ? (
                      <>
                        {" with " + event.interviewer}
                      </>
                    ):(
                      <></>
                    )}
                    </span>
                    
                    <span className="event-time"> - {dayjs(event.start).format('M/D/YYYY H:mm A').toString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events available.</p>
            )}
          </div>
          <button className="schedule-new-interview-button" onClick={() => setModalContent(<NewEventModal jobId={jobId} />)}>
            Schedule New Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;