import { ReactNode, useState } from 'react';
import ModalContext from './ModalContext';

interface IProps {
	children: ReactNode;
}

const ModalProvider = ({ children }: IProps) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // save open modal state to be used globally
  const openModal = () => setModalOpen(true);

  // save closed modal state to be used globally
  const closeModal = () => setModalOpen(false);

  return (
    <ModalContext.Provider value={{ modalOpen, openModal, closeModal }}>
      { children }
    </ModalContext.Provider>
  );

};

export default ModalProvider;
