import { useSelector, useDispatch } from 'react-redux';
import { deleteForm, editForm } from '../../redux/form'; 
import './FormsList.css'; 
import React, { useState } from 'react';



const FormsList = () => {
  const userForms = useSelector((state) => state.form.userForms);
  const dispatch = useDispatch();
  const [editingForm, setEditingForm] = useState(null);
  const [formData, setFormData] = useState({ name: '', link: '' });

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

  return (
    <div className="container">
      <h1>Your Forms</h1>
      {userForms.length === 0 ? (
        <p>No forms found.</p>
      ) : (
        <div className="form-container">
          {userForms.map((form) => (
            <div className="form-item" key={form.id}>
              {editingForm === form.id ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Form Name"
                  />
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="Form Link"
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                </div>
              ) : (
                <div>
                  <div className="form-name">{form.name}</div>
                  <div className="form-link">
                    <a href={form.link} target="_blank" rel="noopener noreferrer">
                      {form.link}
                    </a>
                  </div>
                  <button onClick={() => handleEditForm(form)}>Edit</button>
                  <button onClick={() => handleDeleteForm(form.id)}>Delete</button>
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