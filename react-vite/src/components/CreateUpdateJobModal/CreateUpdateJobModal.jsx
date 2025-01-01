import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateJob, thunkEditJob } from "../../redux/session";
import { Navigate } from "react-router-dom";
import "./CreateUpdateJobModal.css";


function CreateUpdateJobModal({ jobData, closeModal }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [name, setName] = useState(jobData ? jobData.name : "");
    const [location, setLocation] = useState(jobData ? jobData.location : "");
    const [employer, setEmployer] = useState(jobData ? jobData.employer : "");
    const [pay, setPay] = useState(jobData ? jobData.pay : "");
    const [errors, setErrors] = useState({});

    if (!sessionUser) return <Navigate to="/login" replace={true} />;
    if (sessionUser) return <Navigate to="/jobs/new" replace={true} />;

    const handleSubmit = async (e) => {
        e.preventDefault();

            const jobPayload = { name, location, employer, pay };
            let serverResponse;

            if (jobData) {

                serverResponse = await dispatch(thunkEditJob(jobData.id, jobPayload));
            }   else {
                    serverResponse = await dispatch(thunkCreateJob(jobPayload));
            }

            if (serverResponse) {
                setErrors(serverResponse);
            } else {
                closeModal();
            }
    };

    return (
        <div className="job-modal">
            <h1>{jobData ? "Edit Job" : "Create Job"}</h1>
            {errors.length > 0 && errors.map((message) => <p key={message}>{message}</p>)}
            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                </label>
                {errors.name && <p>{errors.name}</p>}
                <label>
                    Location
                    <input 
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </label>
                {errors.location && <p>{errors.location}</p>}
                <label>
                    Employer
                    <input 
                        type="text"
                        value={employer}
                        onChange={(e) => setEmployer(e.target.value)} 
                        required
                        />
                </label>
                {errors.employer && <p>{errors.employer}</p>}
                <label>
                    Pay
                    <input 
                        type="text"
                        value={pay}
                        onChange={(e) => setPay(e.target.value)}
                    />
                </label>
                {errors.pay && <p>{errors.pay}</p>}
                <button type="submit">{jobData ? "Update Job" : "Create Job"}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </form>
        </div>
    );
}

export default CreateUpdateJobModal;