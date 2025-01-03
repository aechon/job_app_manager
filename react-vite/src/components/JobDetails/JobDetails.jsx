import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobDetails, clearJobDetails } from '../../redux/job';
import { useParams } from 'react-router-dom';
import './JobDetails.css';

const JobDetails = () => {
  const { jobId } = useParams(); 
  const dispatch = useDispatch();

  const { jobDetails, loading, error } = useSelector((state) => state.job);

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
    return <div>Error: {error}</div>;
  }

  if (!jobDetails) {
    return <div>No job details found.</div>;
  }

  const handleEditContact = (contactId) => {
    console.log(`Edit contact with ID: ${contactId}`);

  };

  const handleDeleteContact = (contactId) => {
    console.log(`Delete contact with ID: ${contactId}`);
 
  };

  const handleEditEvent = (eventId) => {
    console.log(`Edit event with ID: ${eventId}`);

  };

  const handleDeleteEvent = (eventId) => {
    console.log(`Delete event with ID: ${eventId}`);

  };

  const testContacts = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const testEvents = [
    { id: 1, name: 'Meeting', date: '2025-01-10' },
    { id: 2, name: 'Interview', date: '2025-01-15' },
  ];

  return (
    <div className="job-details-container">
      <h1>Job Details</h1>
      <p><strong>Job ID:</strong> {jobDetails.id}</p>
      <p><strong>Job Name:</strong> {jobDetails.name}</p>
      <p><strong>Employer:</strong> {jobDetails.employer}</p>
      <p><strong>Location:</strong> {jobDetails.location}</p>
      <p><strong>Pay:</strong> ${jobDetails.pay}</p>
      <p><strong>Creator ID:</strong> {jobDetails.creatorId}</p>

      <div className="contacts-events-container">
        <div className="contacts-section">
          <h2>Contacts</h2>
                {/* {jobDetails.Contacts.length > 0 ? (
        <ul>
          {jobDetails.Contacts.map((contact, index) => ( */}
          {testContacts.length > 0 ? (
            <ul>
              {testContacts.map((contact, index) => (
                <li key={index}>
                  {contact.name} - {contact.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No contacts available.</p>
          )}
          {/* Buttons Section for Contacts */}
          <div className="buttons-container">
            <button className="edit-job-button" onClick={() => handleEditContact(1)}>Edit Contact</button>
            <button className="delete-job-button" onClick={() => handleDeleteContact(1)}>Delete Contact</button>
          </div>
        </div>

        <div className="events-section">
          <h2>Events</h2>
                {/* {jobDetails.Events.length > 0 ? (
        <ul>
          {jobDetails.Events.map((event, index) => ( */}
          {testEvents.length > 0 ? (
            <ul>
              {testEvents.map((event, index) => (
                <li key={index}>
                  {event.name} - {event.date}
                </li>
              ))}
            </ul>
          ) : (
            <p>No events available.</p>
          )}
    
          <div className="buttons-container">
            <button className="edit-job-button" onClick={() => handleEditEvent(1)}>Edit Event</button>
            <button className="delete-job-button" onClick={() => handleDeleteEvent(1)}>Delete Event</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;