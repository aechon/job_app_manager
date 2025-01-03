import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { DatePicker, TimePicker } from "antd";
import { createEvent } from "../../redux/event";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import "./EventModal.css";

function NewEventModal({jobId, contacts = []}) { 
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [duration, setDuration] = useState(30);
  const [type, setType] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [contactId, setContactId] = useState(null);
  const [disable, setDisable] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    if (date === null || date.isBefore(dayjs()) || time === null || duration <= 0 || interviewer.length > 50) setDisable(true);
    else setDisable(false);
  }, [date, time, duration, interviewer])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const localStart = dayjs(date.format('YYYY-MM-DD') + ' ' + time.format('HH:MM' + ':00'), 'YYYY-MM-DD HH:MM:SS');
    dayjs.extend(utc);
    const start = localStart.utc().format('YYYY-MM-DD HH:mm:ss');

    // Dispatch the createEvent action
    const serverResponse = await dispatch(
      createEvent({
        start,
        duration,
        type,
        interviewer,
        jobId,
      })
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

  if (contacts.length === 0) contacts = null;

  return (
    <div className="event-modal">
      <h1 className="event-modal-title">New Interview</h1>
      <form className="event-modal-form" onSubmit={handleSubmit}>
        <label> Start Time</label>
        <span className="event-modal-span">
          <DatePicker className="date-time-picker" 
            onChange={(date) => setDate(date)}
          />
          <TimePicker format='HH:mm' className="date-time-picker"
            onChange={(time) => setTime(time)}
          />
        </span>
        <label className="event-modal-label">
          Duration (In minutes): 
          <input
            className="event-modal-input-number"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </label>
        {errors.name && <p className="error-message">{errors.name}</p>}
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

          </select>
          </label>
        ) : (
          <></>
        )}
        {errors.message && <p className="error-message">{errors.message}</p>}
        <button className="event-modal-button" type="submit" disabled={disable}>Add to schedule</button>
      </form>
    </div>
  );
}

export default NewEventModal;