// src/components/FormDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const FormDetail = () => {
    const { id } = useParams(); // Get the form ID from the URL
    const userForms = JSON.parse(localStorage.getItem('userForms')) || []; // Retrieve forms from local storage or state

    const form = userForms.find((form) => form.id === parseInt(id)); // Find the form by ID

    if (!form) {
        return <div>Form not found.</div>;
    }

    return (
        <div>
            <h1>{form.name}</h1>
            <p>
                <a href={form.link} target="_blank" rel="noopener noreferrer">
                    {form.link}
                </a>
            </p>
        </div>
    );
};

export default FormDetail;