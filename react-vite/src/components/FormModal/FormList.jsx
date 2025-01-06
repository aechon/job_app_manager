import { useSelector, useDispatch } from 'react-redux';
import { deleteForm, editForm, fetchUserForms } from '../../redux/form'; 
import './FormsList.css'; 
import { useEffect } from 'react';
import { useModal } from "../../context/Modal"; 
import FormModal from "../FormModal/FormModal"; 

const FormsList = () => {
  const userForms = useSelector((state) => state.form.userForms);
  const user = useSelector((state) => state.session.user); 
  const dispatch = useDispatch();
  const { setModalContent } = useModal(); 

  useEffect(() => {
    dispatch(fetchUserForms());
  }, [dispatch]);

  const handleDeleteForm = (formId) => {
    dispatch(deleteForm(formId));
  };

  const handleEditForm = (form) => {
    const handleSaveEdit = (updatedFormData) => {
      dispatch(editForm({ id: form.id, ...updatedFormData }));
    };

    // Open the modal with the form data
    setModalContent(
      <FormModal 
        initialData={{ name: form.name, link: form.link }} 
        onSave={handleSaveEdit} 
        onClose={() => setModalContent(null)} 
      />
    );
  };

  const handleOpenFormModal = () => {
    setModalContent(<FormModal onClose={() => setModalContent(null)} />); 
  };

  return (
    <div className="container">
      <div className="create-form-container"> 
        {user && ( 
          <button onClick={handleOpenFormModal} className="create-form-button">Create Form</button>
        )}
      </div>
      {userForms.length === 0 ? (
          <p className="centered-message">No forms found.</p>
      ) : (
        <div className="form-container">
          {userForms
          .sort((a, b) => {
            if (a.name.localeCompare(b.name) > 0) return 1;
            else return -1;
          })
          .map((form) => (
            <div className="form-item" key={form.id}>
              <div className="form-content">
                <div className="form-name">Name: {form.name}</div>
                <div className="form-link">
                  <span>Link: </span>
                  <a href={form.link} target="_blank" rel="noopener noreferrer">
                    {form.link}
                  </a>
                </div>
                <div className="form-buttons">
                  <button className="edit-button" onClick={() => handleEditForm(form)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteForm(form.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsList;