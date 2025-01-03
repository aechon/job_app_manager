import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useModal } from "../../context/Modal"; 
import FormModal from "../FormModal/FormModal"; 
import logo from '../../components/Navigation/coding.png'; 
import "./Navigation.css";

function Navigation() {
  const { setModalContent, openModal } = useModal(); 

  const handleOpenFormModal = () => {
    setModalContent(<FormModal />); 
    openModal(); 
  };

  return (
    <div className="navigation-container">
      <NavLink to="/" className="nav-logo-link">
        <img src={logo} alt="Logo" className="nav-logo" />
      </NavLink>
      <ul className="navigation-list"> 
        <li>
          <NavLink to="/user-forms" className="nav-button">Form</NavLink>
        </li>
        <li>
          <NavLink to="/jobs/1/forms" className="nav-button">Jobs & Form</NavLink> 
        </li>
        <li>
        <NavLink to="/jobs/1" className="nav-button">Job Details</NavLink>
        </li>
        <li>
          <NavLink to="/jobs/1/forms" className="nav-button">Contact</NavLink>
        </li>
      </ul>
      <div className="profile-button">
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;