import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './ProfileButton.css'; 

function ProfileButton() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((store) => store.session.user);
  const modalRef = useRef();
  const navigate = useNavigate();

  const toggleModal = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (!showModal) return;

    const closeModal = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("click", closeModal);

    return () => document.removeEventListener("click", closeModal);
  }, [showModal]);

  const closeModal = () => setShowModal(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout()).then(() => {
      closeModal();
      navigate('/');
      // setTimeout(() => {
      //   window.location.reload(); // Refresh the page after a short delay
      // }, 100); // Delay of 100 milliseconds
    });
  };
  return (
    <>
      <button onClick={toggleModal}>
        <FaUserCircle />
      </button>
      {showModal && (
        <div className="overlay" onClick={closeModal}>
          <div className="popup" ref={modalRef}>
            <h2>Profile Information</h2>
            <a className="close" onClick={closeModal}>&times;</a>
            <div className="content">
              {user ? (
                <>
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                  <button onClick={logout}>Log Out</button>
                </>
              ) : (
                <>
                  <OpenModalMenuItem
                    itemText="Log In"
                    onItemClick={closeModal}
                    modalComponent={<LoginFormModal />}
                    className="login-button" 
                  />
                  <OpenModalMenuItem
                    itemText="Sign Up"
                    onItemClick={closeModal}
                    modalComponent={<SignupFormModal />}
                    className="signup-button" 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileButton;