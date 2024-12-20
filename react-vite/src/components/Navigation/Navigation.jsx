// src/components/Navigation/Navigation.jsx
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useModal } from "../../context/Modal"; // Import useModal
import FormModal from "../FormModal/FormModal"; // Ensure this import is correct
import "./Navigation.css";

function Navigation() {
  const { setModalContent, openModal } = useModal(); // Get setModalContent and openModal

  const handleOpenFormModal = () => {
    setModalContent(<FormModal />); // Set the content of the modal to FormModal
    openModal(); // Open the modal
  };

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/user-forms">Your Forms</NavLink>
      </li>
      <li>
        <button onClick={handleOpenFormModal}>Open Form Modal</button> {/* Open modal on click */}
      </li>
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;