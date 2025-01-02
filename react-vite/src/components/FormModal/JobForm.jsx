import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const JobForm = () => {
  const { jobId } = useParams(); // Get jobId from the URL parameters
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          const errorData = await response.text(); // Log the error response
          console.error('Error response:', errorData);
          throw new Error('An error occurred while fetching forms.');
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        setForms(data); // Set forms directly to the fetched data
      } catch (err) {
        setError(err.message || 'An error occurred while fetching forms.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobForms();
  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="job-forms-container">
      <h2>Related Forms for Job ID: {jobId}</h2>
      <div className="navigation-buttons">
      </div>
      {forms.length === 0 ? (
        <p>No forms found for this job.</p>
      ) : (
        <ul>
          {forms.map((form) => (
            <li key={form.id}>
              <div className="form-name">Name: {form.name}</div>
              <div className="form-link">
              <div className="form-userId">User ID: {form.userId}</div>
                <span>Link: </span>
                <a href={form.link} target="_blank" rel="noopener noreferrer">
                  {form.link}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobForm;