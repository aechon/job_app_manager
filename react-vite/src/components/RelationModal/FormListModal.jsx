import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchUserForms } from '../../redux/form';
import { addJobFormRelation } from '../../redux/job';
import './ListModal.css'; 
import { useModal } from "../../context/Modal";

const FormListModal = ({ jobId, onAddForm }) => {
  const userForms = useSelector((state) => state.form.userForms);
  const user = useSelector((state) => state.session.user); 
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(fetchUserForms());
  }, [dispatch]);

  const handleAddForm = async (formId) => {
    const serverResponse = await dispatch(addJobFormRelation(jobId, formId));
    if (serverResponse) {
      setErrors(serverResponse);
    } else {
     
      const newFormDetails = await fetch(`/api/forms/${formId}`); 
      const newForm = await newFormDetails.json(); 

      onAddForm(newForm); // Call the onAddForm <==================
      closeModal();
    }  
  };

  return (
    <div className="pop_container">
      <h2 className="modal-title">Add Form to Job</h2>
      {userForms.length === 0 ? (
        <p className="centered-message">No forms found.</p>
      ) : (
        <div className="relation-container">
          {errors.message && <p className="error-message">{errors.message}</p>}
          {userForms.map((form) => (
            <div 
              className="relation-item" 
              key={form.id} 
              onClick={() => handleAddForm(form.id)} // Make the hover clickable
              role="button" 
              tabIndex={0} 
              onKeyPress={(e) => { if (e.key === 'Enter') handleAddForm(form.id); }}
            >
              <div className="relation-content">
                <div className="relation-name">{form.name}</div>
                <div className="relation-link">
                  <a href={form.link} target="_blank" rel="noopener noreferrer">{form.link}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="close-button-container"> 
        {user && ( 
          <button onClick={closeModal} className="close-button">Close</button>
        )}
      </div>
    </div>
  );
};

export default FormListModal;