import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { DatePicker, TimePicker } from "antd";
import { fetchEventDetails } from "../../redux/event";
import dayjs from 'dayjs';
import "./EventModal.css";

function EventDetailModal({eventId}) { 
  const dispatch = useDispatch();
  const event = useSelector((state) => state.event.event);

  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // fetch event details
  useEffect(() => {
    dispatch(fetchEventDetails(eventId));
  }, [dispatch, eventId]);

  let start = null;
  if (event) start = dayjs(event.start)

  console.log(event);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch the delete action
    const serverResponse = await dispatch(
    //   createEvent({
    //     start,
    //     duration,
    //     type,
    //     interviewer,
    //     jobId,
    //   })
    );

    console.log("Server Response:", serverResponse); // Debugging line

    if (serverResponse) {
      // If there's an error from the server, set the errors
      setErrors(serverResponse);
      console.log(errors);
    } else {
      // If the form is created successfully
    closeModal(); // Close the modal
    }  
  };
  
  return (
    <div className="event-modal">
      <h1 className="event-modal-title">Interview Details</h1>
      <form className="event-modal-form" onSubmit={handleSubmit}>
        <label> Start Time</label>
        <span className="event-modal-span">
          <DatePicker className="date-time-picker" 
            value={start}
            disabled
          />
          <TimePicker format='HH:mm' className="date-time-picker"
            value={start}
            disabled
          />
        </span>
        <label className="event-modal-label">
          Duration (In minutes): 
          <input
            className="event-modal-input-number"
            type="number"
            value={event.duration}
            disabled
          />
        </label>
        {errors.name && <p className="error-message">{errors.name}</p>}
        <label className="event-modal-label">
          Type:
          <select 
            className="event-modal-type"
            value={event.type}
            disabled
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
            value={event.interviewer}
            disabled
          />
        </label>
        {event.Contact ? (
          <label className="event-modal-label">
          Contact Info
          <select
            className="event-modal-contacts"
            disabled
          >
            <option value="null">{event.Contact.name}</option>
          </select>
          </label>
        ) : (
          <></>
        )}
        {errors.message && <p className="error-message">{errors.message}</p>}
        {/* <button className="event-modal-button" >Edit Interview</button> */}
        <button className="event-modal-button-delete" type="submit" >Delete Interview</button>
      </form>
    </div>
  );
}

export default EventDetailModal;