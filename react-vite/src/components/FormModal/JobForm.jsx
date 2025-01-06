import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './JobForm.css';
import { useModal } from "../../context/Modal";
import FormListModal from '../RelationModal/FormListModal'; 

const JobForm = () => {
  const { jobId } = useParams(); 
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setModalContent } = useModal();

  useEffect(() => {
    const fetchJobForms = async () => {
      try {
        const response = await fetch(`/api/forms/job/${jobId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.text(); 
          console.error('Error response:', errorData);
          throw new Error('An error occurred while fetching forms.');
        }

        const data = await response.json();
        setForms(data); 
      } catch (err) {
        setError(err.message || 'An error occurred while fetching forms.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobForms();
  }, [jobId]);

  const handleRemoveForm = async (formId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/forms/${formId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting form:', errorData);
        throw new Error('An error occurred while deleting the form.');
      }

      setForms((prevForms) => prevForms.filter(form => form.id !== formId));
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An unexpected error occurred while removing the form.');
    }
  };

  const handleAddForm = (newForm) => {
    setForms((prevForms) => [...prevForms, newForm]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="job-forms-container">
      <h2>Related Forms for Job ID: {jobId}</h2>
      <div className="job-form-list">
        {forms.length === 0 ? (
          <p>No forms found for this job.</p>
        ) : (
          <ul>
            {forms.map((form) => (
              <li key={form.id} className="form-item">
                <div className="form-details">
                  <div className="form-name">Name: {form.name}</div>
                  <div className="form-userId">User ID: {form.userId}</div>
                  <div className="form-link">
                    <span>Link: </span>
                    <a href={form.link} target="_blank" rel="noopener noreferrer">
                      {form.link}
                    </a>
                  </div>
                  <button className="remove-form-button" onClick={() => handleRemoveForm(form.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="add-form-button" onClick={() => setModalContent(<FormListModal jobId={jobId} onAddForm={handleAddForm} />)}>Add Form</button>
    </div>
  );
};

export default JobForm;