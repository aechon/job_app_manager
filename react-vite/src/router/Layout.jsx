// src/Layout.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import FormModal from "../components/FormModal/FormModal"; 

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false); 

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const openModal = () => setModalOpen(true); 
  const closeModal = () => setModalOpen(false); 

  return (
    <>
      <ModalProvider>
        <Navigation openModal={openModal} />
        {isLoaded && <Outlet />}
        {isModalOpen && <FormModal onClose={closeModal} />} 
        <Modal />
      </ModalProvider>
    </>
  );
}