import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { fetchUserForms } from '../../redux/form';
import { addJobFormRelation } from '../../redux/job';
import './ListModal.css'; 
import { useEffect } from 'react';
import { useModal } from "../../context/Modal";

const FormListModal = ({ jobId, jobForms = []}) => {
  const userForms = useSelector((state) => state.form.userForms);
  const user = useSelector((state) => state.session.user); 
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(fetchUserForms());
  }, [dispatch]);

//   const unaddedFormList = [] - jobForms;

  const handleAddForm = (formId) => {
    // Dispatch the addJobFormRelation action
     const serverResponse = dispatch(addJobFormRelation(jobId, formId));

    console.log("Server Response:", serverResponse); // Debugging line

    if (serverResponse) {
      // If there's an error from the server, set the errors
      setErrors(serverResponse);
    } else {
      // If the contact is created successfully
    closeModal(); // Close the modal
    }  
  };

  return (
    <div className="container">
      {userForms.length === 0 ? (
          <p className="centered-message">No forms found.</p>
      ) : (
        <div className="relation-container">
          {errors.message && <p className="error-message">{errors.message}</p>}
          {userForms.map((form) => (
            <div className="relation-item" key={form.id}>
              <div className="relation-content">
                <span>
                  <div className="relation-name">{form.name}</div>
                  <div className="relation-buttons">
                  <button className="edit-button" onClick={() => handleAddForm(form.id)}>Add</button>
                  </div>
                </span>
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