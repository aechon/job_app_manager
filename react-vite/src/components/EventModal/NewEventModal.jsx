import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { DatePicker, TimePicker } from "antd";
import "./EventModal.css";

function NewEventModal({jobId, contacts}) { 
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  console.log(jobId);
  console.log(contacts);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    // const validationErrors = {};
    // if (!/^[a-zA-Z\s]+$/.test(name)) {
    //   validationErrors.name = "Name must contain only letters and spaces.";
    // }
    // if (!/^https?:\/\/.+/.test(link)) {
    //   validationErrors.link = "Invalid link format.";
    // }

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return; 
    // }

    // Dispatch the createEvent action
    const serverResponse = await dispatch(
      // createEvent({
      //   name,
      //   link,
      // })
    );

    // console.log("Server Response:", serverResponse); // Debugging line

    if (serverResponse) {
      // If there's an error from the server, set the errors
      setErrors(serverResponse);
    } else {
      // If the form is created successfully
      closeModal(); // Close the modal
    }  
  };

  return (
    <div className="event-modal">
      <h1 className="event-modal-title">New Interview</h1>
      <form className="event-modal-form" onSubmit={handleSubmit}>
        <label> Start Time</label>
        <span className="event-modal-span"><DatePicker /> <TimePicker format='HH:mm'/></span>
        <label className="event-modal-label">
          Duration
          <input
            className="event-modal-input"
            type="text"
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p className="error-message">{errors.name}</p>}
        <label className="event-modal-label">
          Type:
          <select className="event-modal-select">
            <option value="null"></option>
            <option value="zoom">Zoom</option>
            <option value="google meet">Google Meet</option>
            <option value="in person">In-person</option>
          </select>
          {/* <input
            className="event-modal-input"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          /> */}
        </label>
        <label className="event-modal-label">
          Interviewer
          <input
            className="event-modal-input"
            type="text"
            // value={link}
            // onChange={(e) => setLink(e.target.value)}
          />
        </label>
        <label className="event-modal-label">
          Add Contact Info
          <input
            className="event-modal-input"
            type="text"
            // value={link}
            // onChange={(e) => setLink(e.target.value)}
          />
        </label>
        {errors.link && <p className="error-message">{errors.link}</p>}
        <button className="event-modal-button" type="submit">Add to schedule</button>
      </form>
    </div>
  );
}

export default NewEventModal;