import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { thunkCreateForm, thunkEditForm } from "../../redux/session"; // Ensure this path is correct
// import { useDispatch, useSelector } from "react-redux";
// import { thunkCreateForm, thunkEditForm } from "../../redux/session"; // Adjust the import based on your redux setup
import { Navigate } from "react-router-dom";
import "./FormModal.css"; 





function FormModal({ formData, closeModal }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [name, setName] = useState(formData ? formData.name : "");
  const [link, setLink] = useState(formData ? formData.link : "");
  const [errors, setErrors] = useState({});

  if (!sessionUser) return <Navigate to="/login" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formPayload = { name, link };
    let serverResponse;

    if (formData) {
      // If formData exists, we are editing an existing form
      serverResponse = await dispatch(thunkEditForm(formData.id, formPayload));
    } else {
      // Otherwise, we are creating a new form
      serverResponse = await dispatch(thunkCreateForm(formPayload));
    }

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal(); 
    }
  };

  return (
    <div className="form-modal">
      <h1>{formData ? "Edit Form" : "Create Form"}</h1>
      {errors.length > 0 && errors.map((message) => <p key={message}>{message}</p>)}
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
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </label>
        {errors.link && <p>{errors.link}</p>}
        <button type="submit">{formData ? "Update Form" : "Create Form"}</button>
        <button type="button" onClick={closeModal}>Cancel</button>
      </form>
    </div>
  );
}

export default FormModal;