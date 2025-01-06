import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createForm } from "../../redux/form"; 
import { useModal } from "../../context/Modal";
import "./FormModal.css";

function FormModal({ initialData, onSave }) { 
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // Set initial data if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLink(initialData.link);
    }
  }, [initialData]);

  const validateInputs = () => {
    const validationErrors = {};
    // if (!/^[a-zA-Z\s]+$/.test(name)) {
    //   validationErrors.name = "Name must contain only letters and spaces.";
    // }
    if (!/^https?:\/\/.+/.test(link)) {
      validationErrors.link = "Invalid link format.";
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }

 
    if (onSave) {
      onSave({ name, link });
      closeModal(); 
      return;
    }

 
    const serverResponse = await dispatch(createForm({ name, link }));

    if (serverResponse) {
  
      setErrors(serverResponse);
    } else {
  
      closeModal(); 
    }  
  };

  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <h1 className="form-modal-title">{initialData ? "Edit Form" : "Create New Form"}</h1>
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
          <div className="form-modal-buttons">
            <button className="form-modal-button" type="submit">
              {initialData ? "Save Changes" : "Create Form"}
            </button>
            <button className="form-modal-close-button" type="button" onClick={closeModal}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModal;