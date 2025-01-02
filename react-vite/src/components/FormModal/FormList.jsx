import { useSelector, useDispatch } from 'react-redux';
import { deleteForm, editForm, fetchUserForms } from '../../redux/form'; 
import './FormsList.css'; 
import { useState, useEffect } from 'react';
import { useModal } from "../../context/Modal"; 
import FormModal from "../FormModal/FormModal"; 

const FormsList = () => {
  const userForms = useSelector((state) => state.form.userForms);
  const user = useSelector((state) => state.session.user); // Assuming user info is stored here
  const dispatch = useDispatch();
  const [editingForm, setEditingForm] = useState(null);
  const [formData, setFormData] = useState({ name: '', link: '' });
  const { setModalContent } = useModal(); // Get modal functions

  useEffect(() => {
    dispatch(fetchUserForms()); // Fetch forms fixed reload issue
  }, [dispatch]);

  const handleDeleteForm = (formId) => {
    dispatch(deleteForm(formId));
  };

  const handleEditForm = (form) => {
    setEditingForm(form.id);
    setFormData({ name: form.name, link: form.link });
  };

  const handleSaveEdit = () => {
    dispatch(editForm({ id: editingForm, ...formData }));
    setEditingForm(null); 
    setFormData({ name: '', link: '' }); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleOpenFormModal = () => {
    setModalContent(<FormModal />); 
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
          {userForms.map((form) => (
            <div className="form-item" key={form.id}>
              {editingForm === form.id ? (
                <div>
                  <label htmlFor={`name-${form.id}`}>Name:</label>
                  <input
                    type="text"
                    id={`name-${form.id}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Form Name"
                  />
                  <label htmlFor={`link-${form.id}`}>Link:</label>
                  <input
                    type="text"
                    id={`link-${form.id}`}
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="Form Link"
                  />
                  <button className="save-button" onClick={handleSaveEdit}>Save</button>
                </div>
              ) : (
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsList;