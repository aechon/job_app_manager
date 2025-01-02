import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllContactsThunk, deleteContactThunk, createContactThunk, updateContactThunk } from "../../redux/contact";

const ContactList = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts);
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", userId: "" });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(getAllContactsThunk());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      dispatch(updateContactThunk(currentId, form));
      setEditing(false);
      setCurrentId(null);
    } else {
      dispatch(createContactThunk(form));
    }
    setForm({ name: "", phone: "", email: "", company: "", userId: "" });
  };

  const handleEdit = (contact) => {
    setForm(contact);
    setEditing(true);
    setCurrentId(contact.id);
  };

  const handleDelete = (contactId) => {
    dispatch(deleteContactThunk(contactId));
  };

  return (
    <div>
      <h2>Contact List</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="text" name="phone" value={form.phone} onChange={handleInputChange} placeholder="Phone" required />
        <input type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email" required />
        <input type="text" name="company" value={form.company} onChange={handleInputChange} placeholder="Company" required />
        <input type="hidden" name="userId" value={form.userId} />
        <button type="submit">{editing ? "Update" : "Add"} Contact</button>
      </form>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <p>
              {contact.name} - {contact.phone} - {contact.email} - {contact.company}
            </p>
            <button onClick={() => handleEdit(contact)}>Edit</button>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
