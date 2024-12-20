
import React from 'react';
import { useSelector } from 'react-redux';
import './FormsList.css'; 

const FormsList = () => {
    const userForms = useSelector((state) => state.form.userForms);

    return (
        <div className="container">
            <h1>Your Forms</h1>
            {userForms.length === 0 ? (
                <p>No forms found.</p>
            ) : (
                <div className="form-container">
                    {userForms.map((form) => (
                        <div className="form-item" key={form.id}>
                            <div className="form-name">{form.name}</div>
                            <div className="form-link">
                                <a href={form.link} target="_blank" rel="noopener noreferrer">
                                    {form.link}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormsList;