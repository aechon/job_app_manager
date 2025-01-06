import { useSelector, useDispatch } from 'react-redux';
import { deleteContactThunk, getAllContactsThunk, updateContactThunk } from '../../redux/contact';
import { useState, useEffect } from 'react';
import { NewContactModal } from '../../components/ContactModal'
import { useModal } from "../../context/Modal"; 
import './ContactList.css';

const ContactListPage = () => {
  const contacts = useSelector((state) => state.contact.contacts);
  const user = useSelector((state) => state.session.user); // Assuming user info is stored here
  const dispatch = useDispatch();
  const [editingContact, setEditingContact] = useState(null);
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', company: ''});
  const { setModalContent } = useModal(); // Get modal functions

  useEffect(() => {
    // Fetch all contacts on component mount
    dispatch(getAllContactsThunk());
  }, [dispatch]);

  console.log(contacts);

  const handleDeleteContact = (contactId) => {
    dispatch(deleteContactThunk(contactId));
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact.id);
    setContactData({ 
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company
     });
  };

  const handleSaveEdit = () => {

    console.log(editingContact);
    console.log(contactData);
    dispatch(
      updateContactThunk(editingContact, contactData)
    );
    setEditingContact(null); 
    setContactData({ name: '', email: '', phone: '', company: ''}); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNewContactModal = () => {
    setModalContent(<NewContactModal />); 
  };

  return (
    <div className="container">
      <div className="create-contact-container"> 
        {user && ( 
          <button onClick={handleNewContactModal} className="create-contact-button">New Contact</button>
        )}
      </div>
      {contacts.length === 0 ? (
          <p className="centered-message">No contacts found.</p>
      ) : (
        <div className="contact-container">
          {contacts
          .sort((a, b) => {
            if (a.name.localeCompare(b.name) > 0) return 1;
            else return -1;
          })
          .map((contact) => (
            <div className="contact-item" key={contact.id}>
              {editingContact === contact.id ? (
                <div>
                  <label htmlFor={`name-${contact.id}`}>Name:</label>
                  <input
                    type="text"
                    id={`name-${contact.id}`}
                    name="name"
                    value={contactData.name}
                    onChange={handleChange}
                    placeholder="Contact Name"
                  />
                  <label htmlFor={`email-${contact.id}`}>Email:</label>
                  <input
                    type="email"
                    id={`email-${contact.id}`}
                    name="email"
                    value={contactData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <label htmlFor={`phone-${contact.id}`}>Phone:</label>
                  <input
                    type="tel"
                    id={`phone-${contact.id}`}
                    name="phone"
                    value={contactData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                  <label htmlFor={`company-${contact.id}`}>Company:</label>
                  <input
                    type="text"
                    id={`company-${contact.id}`}
                    name="company"
                    value={contactData.company}
                    onChange={handleChange}
                    placeholder="Company"
                  />
                  <button className="save-button" onClick={handleSaveEdit}>Save</button>
                </div>
              ) : (
                <div className="contact-content">
                  <div className='contact-content-details'>
                    <div className="contact-name">Name: {contact.name}</div>
                    <div className="contact-company">Company:  
                      {contact.company}
                      {/* {contact.company === '' ? (
                        <text> N/A</text>
                      ) : (
                        <text> {contact.company}</text>
                      )} */}
                    </div>
                    <div className="contact-email">Email:  
                      {contact.email}
                      {/* {contact.email === '' ? (
                        <text> N/A</text>
                      ) : (
                        <text> {contact.email}</ text>
                      )} */}
                    </div>
                    <div className="contact-phone">Phone:  
                      {contact.phone}
                      {/* {contact.phone === '' ? (
                        <text> N/A</text>
                      ) : (
                        <text> {contact.phone}</text>
                      )} */}
                    </div>
                  </div>
                  <div className="contact-buttons">
                    <button className="edit-button" onClick={() => handleEditContact(contact)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteContact(contact.id)}>Delete</button>
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

export default ContactListPage;