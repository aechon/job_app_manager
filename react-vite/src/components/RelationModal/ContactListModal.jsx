import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { getAllContactsThunk } from '../../redux/contact';
import { addJobContactRelation } from '../../redux/job';
import './ListModal.css'; 
import { useModal } from "../../context/Modal";
import { fetchJobDetails } from "../../redux/job";

const ContactListModal = ({ jobId, jobContacts = [] }) => {
  const contacts = useSelector((state) => state.contact.contacts);
  const user = useSelector((state) => state.session.user); 
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(getAllContactsThunk());
  }, [dispatch]);

  const handleAddContact = async (contactId) => {
    const serverResponse = await dispatch(addJobContactRelation(jobId, contactId));

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      await dispatch(fetchJobDetails(jobId));
      closeModal();
    }  
  };

  const handleContactClick = async (contactId) => {
    await handleAddContact(contactId);
  };

  return (
    <div className="pop_container">
        <h2 className="modal-title">Add Contact to Job</h2>
        {contacts.length === 0 ? (
            <p className="centered-message">No contacts found.</p>
        ) : (
            <div className="relation-container">
                {errors.message && <p className="error-message">{errors.message}</p>}
                {contacts.map((contact) => {
                    const isAdded = jobContacts.some(jobContact => jobContact.id === contact.id);
                    return (
                        <div 
                            className="relation-item" 
                            key={contact.id}
                            onClick={() => !isAdded && handleContactClick(contact.id)} // Prevent adding if already added
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => { if (e.key === 'Enter' && !isAdded) handleContactClick(contact.id); }}
                        >
                            <div className="relation-content">
                                <div className="relation-name">
                                    {contact.name}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
        <div className="close-button-container"> 
       
        </div>
    </div>
);
};

export default ContactListModal;