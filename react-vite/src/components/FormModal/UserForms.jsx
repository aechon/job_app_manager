
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserForms } from '../../redux/form'; 
import { useNavigate } from 'react-router-dom'; 

const UserForms = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const userForms = useSelector((state) => state.form.userForms);
    const errors = useSelector((state) => state.form.errors);

    useEffect(() => {
        const getForms = async () => {
            await dispatch(fetchUserForms());
            // Navigate to the FormsList page after fetching forms
            navigate('/forms-list');
        };

        getForms();
    }, [dispatch, navigate]);

    if (errors && errors.server) {
        return <div>Error: {errors.server}</div>;
    }

    return null; 
};

export default UserForms;