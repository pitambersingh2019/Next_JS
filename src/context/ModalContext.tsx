import { createContext } from 'react';

const ModalContext = createContext({
  modalOpen: false,
  openModal: () => {},
  closeModal: () => {}
});

export default ModalContext;
