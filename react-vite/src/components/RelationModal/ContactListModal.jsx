import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { getAllContactsThunk } from '../../redux/contact';
import { addJobContactRelation } from '../../redux/job';
import './ListModal.css'; 
import { useEffect } from 'react';
import { useModal } from "../../context/Modal";

const ContactListModal = ({ jobId, jobContacts = []}) => {
  const contacts = useSelector((state) => state.contact.contacts);
  const user = useSelector((state) => state.session.user); 
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    // Fetch all contacts on component mount
    dispatch(getAllContactsThunk());
  }, [dispatch]);

//   const unaddedContactList = [] - jobContacts;

  const handleAddContact = (contactId) => {
    // Dispatch the addJobContactRelation action
     const serverResponse = dispatch(addJobContactRelation(jobId, contactId));

    console.log("Server Response:", serverResponse); // Debugging line

    if (serverResponse) {
      // If there's an error from the server, set the errors
      setErrors(serverResponse);
    } else {
      // If the contact is created successfully
    closeModal(); // Close the modal
    }  
  };

  return (
    <div className="container">
      {contacts.length === 0 ? (
          <p className="centered-message">No contacts found.</p>
      ) : (
        <div className="relation-container">
          {errors.message && <p className="error-message">{errors.message}</p>}
          {contacts.map((contact) => (
            <div className="relation-item" key={contact.id}>
              <div className="relation-content">
                <span>
                  <div className="relation-name">{contact.name}</div>
                  <div className="relation-buttons">
                  <button className="edit-button" onClick={() => handleAddContact(contact.id)}>Add</button>
                  </div>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="close-button-container"> 
        {user && ( 
          <button onClick={closeModal} className="close-button">Close</button>
        )}
      </div>
    </div>
  );
};

export default ContactListModal;