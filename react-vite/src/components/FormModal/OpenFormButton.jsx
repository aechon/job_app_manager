import React from 'react';
import { useModal } from '../../context/Modal';
import FormModal from './FormModal'; // Adjust the import path as necessary

const OpenFormButton = () => {
  const { setModalContent, openModal } = useModal();

  const handleOpenModal = () => {
    setModalContent(<FormModal />); // Set the content of the modal to FormModal
    openModal(); // Open the modal
  };

  return (
    <button onClick={handleOpenModal}>
      Open Form Modal
    </button>
  );
};

export default OpenFormButton;