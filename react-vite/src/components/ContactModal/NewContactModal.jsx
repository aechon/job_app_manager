import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./ContactModal.css";
import { createContactThunk } from "../../redux/contact";

function NewContactModal() { 
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch the createContact action
    const serverResponse = await dispatch(
      createContactThunk({
        name,
        email,
        phone,
        company,
      })
    );

    console.log("Server Response:", serverResponse); // Debugging line

    if (serverResponse) {
      // If there's an error from the server, set the errors
      setErrors(serverResponse.errors);
    } else {
      // If the contact is created successfully
    closeModal(); // Close the modal
    }  
  };
  
  return (
    <div className="contact-modal">
      <h1 className="contact-modal-title">New Contact</h1>
      <form className="contact-modal-form" onSubmit={handleSubmit}>
        <label className="contact-modal-label">
          Name: 
          <input
            className="contact-modal-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p className="error-message">{errors.name}</p>}
        <label className="contact-modal-label">
          Email: 
          <input
            className="contact-modal-input-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {errors.email && <p className="error-message">{errors.email}</p>}
        <label className="contact-modal-label">
          Phone: 
          <input
            className="contact-modal-input-tel"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        {errors.phone && <p className="error-message">{errors.phone}</p>}
        <label className="contact-modal-label">
          Company: 
          <input
            className="contact-modal-input"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        {errors.company && <p className="error-message">{errors.company}</p>}
        <button className="contact-modal-button" type="submit" >Create Contact</button>
      </form>
    </div>
  );
}

export default NewContactModal;