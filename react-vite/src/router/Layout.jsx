// import { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { ModalProvider, Modal } from "../context/Modal";
// import { thunkAuthenticate } from "../redux/session";
// import Navigation from "../components/Navigation/Navigation";
// // import FormModal from "../components/FormModal/FormModal"

// export default function Layout() {
//   const dispatch = useDispatch();
//   const [isLoaded, setIsLoaded] = useState(false);
//   useEffect(() => {
//     dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
//   }, [dispatch]);

//   return (
//     <>
//       <ModalProvider>
//         <Navigation />
//         {isLoaded && <Outlet />}
//         <Modal />
//       </ModalProvider>
//     </>
//   );
// }


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
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const openModal = () => setModalOpen(true); // Function to open the modal
  const closeModal = () => setModalOpen(false); // Function to close the modal

  return (
    <>
      <ModalProvider>
        <Navigation openModal={openModal} /> {/* Pass openModal to Navigation */}
        {isLoaded && <Outlet />}
        {isModalOpen && <FormModal onClose={closeModal} />} {/* Render FormModal conditionally */}
        <Modal />
      </ModalProvider>
    </>
  );
}