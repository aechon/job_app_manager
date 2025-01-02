// src/components/FormModal/FormModal.jsx
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

    const serverResponse = await dispatch(
      createForm({
        name,
        link,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      onFormCreated(); 
      closeModal(); 
    }
  };

  return (
    <div>
      <h1>Create New Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
          Link
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </label>
        {errors.link && <p>{errors.link}</p>}
        <button type="submit">Create Form</button>
      </form>
      <button onClick={closeModal}>Close</button> {/* Close button */}
    </div>
  );
}

export default FormModal;