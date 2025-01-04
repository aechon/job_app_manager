import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { DatePicker, TimePicker } from "antd";
import { editEvent } from "../../redux/event";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import "./EventModal.css";
import { fetchJobDetails } from "../../redux/job";

function EditEventModal({eventId, jobId, initialStart = dayjs(), initialDuration = 60, initialType = '', initialInterviewer = '', initialContactId = ''}) { 
  
  const dispatch = useDispatch();
  const jobDetails = useSelector((state) => state.job.jobDetails);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const [date, setDate] = useState(initialStart);
  const [time, setTime] = useState(initialStart);
  const [duration, setDuration] = useState(initialDuration);
  const [type, setType] = useState(initialType);
  const [interviewer, setInterviewer] = useState(initialInterviewer);
  const [contactId, setContactId] = useState(initialContactId);
  const [disable, setDisable] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(fetchJobDetails(jobId));
  }, [dispatch, jobId]);

  useEffect(() => {
    if (jobDetails) setContacts(jobDetails.Contacts)
  }, [jobDetails])

  useEffect(() => {
    if (date === null || date.isBefore(dayjs()) || time === null || duration <= 0 || interviewer.length > 50) setDisable(true);
    else setDisable(false);
  }, [date, time, duration, interviewer])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const localStart = dayjs(date.format('YYYY-MM-DD') + ' ' + time.format('HH:mm' + ':00'), 'YYYY-MM-DD HH:mm:ss');
    dayjs.extend(utc);
    const start = localStart.utc().format('YYYY-MM-DD HH:mm:ss');

    // Dispatch the editEvent action
    const serverResponse = await dispatch(
      editEvent({
        start,
        duration,
        type,
        interviewer,
        jobId,
      }, eventId)
    );

    // console.log("Server Response:", serverResponse); // Debugging line

    if (serverResponse) {
      // If there's an error from the server, set the errors
      setErrors(serverResponse);
      console.log(errors);
    } else {
      // If the form is created successfully
    closeModal(); // Close the modal
    }  
  };

  if (contacts) {
    if (contacts.length === 0) setContacts(null);
  }
  
  return (
    <div className="event-modal">
      <h1 className="event-modal-title">Update Interview</h1>
      <form className="event-modal-form" onSubmit={handleSubmit}>
        <label> Start Time</label>
        <span className="event-modal-span">
          <DatePicker className="date-time-picker"
            value={date}
            onChange={(date) => setDate(date)}
          />
          <TimePicker format='HH:mm' className="date-time-picker"
            value={time}
            onChange={(time) => setTime(time)}
          />
        </span>
        <label className="event-modal-label">
          Duration (In minutes): 
          <input
            className="event-modal-input-number"
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            required
          />
        </label>
        <label className="event-modal-label">
          Type:
          <select 
            className="event-modal-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="null"></option>
            <option value="zoom">Zoom</option>
            <option value="google meet">Google Meet</option>
            <option value="in person">In-person</option>
          </select>
        </label>
        <label className="event-modal-label">
          Interviewer
          <input
            className="event-modal-input"
            type="text"
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
          />
        </label>
        {contacts ? (
          <label className="event-modal-label">
          Add Contact Info
          <select
            className="event-modal-contacts"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
          >
            <option value="null"></option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>{contact.name}</option>
            ))}
          </select>
          </label>
        ) : (
          <></>
        )}
        {errors.message && <p className="error-message">{errors.message}</p>}
        <button className="event-modal-button" type="submit" disabled={disable}>Update</button>
      </form>
    </div>
  );
}

export default EditEventModal;