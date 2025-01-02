import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createContactThunk, getAllContactsThunk, getContactByIdThunk, updateContactThunk, deleteContactThunk } from "../../redux/contact";

const Contacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.contacts);
  const currentContact = useSelector((state) => state.contacts.currentContact);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    userId: "",
  });

  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    // Fetch all contacts on component mount
    dispatch(getAllContactsThunk());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateContact = (e) => {
    e.preventDefault();
    dispatch(createContactThunk(formData));
    setFormData({
      name: "",
      phone: "",
      email: "",
      company: "",
      userId: "",
    });
  };

  const handleViewContact = (contactId) => {
    setSelectedContactId(contactId);
    dispatch(getContactByIdThunk(contactId));
  };

  const handleUpdateContact = (e) => {
    e.preventDefault();
    if (selectedContactId) {
      dispatch(updateContactThunk(selectedContactId, formData));
      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        userId: "",
      });
      setSelectedContactId(null);
    }
  };

  const handleDeleteContact = (contactId) => {
    dispatch(deleteContactThunk(contactId));
  };

  return (
    <div>
      <h1>Contacts</h1>

      <form onSubmit={selectedContactId ? handleUpdateContact : handleCreateContact}>
        <h2>{selectedContactId ? "Update Contact" : "Create Contact"}</h2>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
        <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleInputChange} required />
        <input type="text" name="userId" placeholder="User ID" value={formData.userId} onChange={handleInputChange} required />
        <button type="submit">{selectedContactId ? "Update" : "Create"}</button>
      </form>

      <h2>All Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <p>{contact.name}</p>
            <p>{contact.phone}</p>
            <p>{contact.email}</p>
            <p>{contact.company}</p>
            <button onClick={() => handleViewContact(contact.id)}>View</button>
            <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {currentContact && (
        <div>
          <h2>Contact Details</h2>
          <p>Name: {currentContact.name}</p>
          <p>Phone: {currentContact.phone}</p>
          <p>Email: {currentContact.email}</p>
          <p>Company: {currentContact.company}</p>
        </div>
      )}
    </div>
  );
};

export default Contacts;
