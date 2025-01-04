import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import logo from '../../components/Navigation/coding.png'; 
import "./Navigation.css";

function Navigation() {
  const user = useSelector((store) => store.session.user);

  return (
    <div className="navigation-container">
      <NavLink to="/" className="nav-logo-link">
        <img src={logo} alt="Logo" className="nav-logo" />
      </NavLink>
      {user ? (
        <ul className="navigation-list"> 
          <li>
            <NavLink to="/user-jobs" className="nav-button">Jobs</NavLink>
          </li>
          <li>
            <NavLink to="/jobs/1/forms" className="nav-button">Contacts</NavLink>
          </li>
          <li>
        <NavLink to="/jobs/1" className="nav-button">Job Details</NavLink>
        </li>
          <li>
            <NavLink to="/user-forms" className="nav-button">Forms</NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className="nav-button">Calendar</NavLink>
          </li>
        </ul>
      ) : (
        <></>
      )}
      <div className="profile-button">
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;