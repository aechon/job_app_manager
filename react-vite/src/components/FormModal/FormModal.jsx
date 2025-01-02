import { useState } from "react";
import { useDispatch } from "react-redux";
import { createForm } from "../../redux/form"; 
import { useModal } from "../../context/Modal";
import "./FormModal.css";

function FormModal({ onFormCreated }) { 
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    const validationErrors = {};
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      validationErrors.name = "Name must contain only letters and spaces.";
    }
    if (!/^https?:\/\/.+/.test(link)) {
      validationErrors.link = "Invalid link format.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }

    // Dispatch the createForm action
    const serverResponse = await dispatch(
      createForm({
        name,
        link,
      })
    );

    console.log("Server Response:", serverResponse); // Debugging line

    if (serverResponse) {
      // If there's an error from the server, set the errors
      setErrors(serverResponse);
    } else {
      // If the form is created successfully
      onFormCreated(); // Call the callback to notify the parent component
      closeModal(); // Close the modal
    }  
  };

  return (
    <div className="form-modal">
      <h1 className="form-modal-title">Create New Form</h1>
      <form className="form-modal-form" onSubmit={handleSubmit}>
        <label className="form-modal-label">
          Name
          <input
            className="form-modal-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p className="error-message">{errors.name}</p>}
        <label className="form-modal-label">
          Link
          <input
            className="form-modal-input"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </label>
        {errors.link && <p className="error-message">{errors.link}</p>}
        <button className="form-modal-button" type="submit">Create Form</button>
      </form>
    </div>
  );
}

export default FormModal;