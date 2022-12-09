import { ReactNode } from 'react';
import { LazyProvider, ModalProvider, NavProvider } from '_context';

interface IProps {
	children: ReactNode;
}

// all component-level context providers are here, extracted to keep parent component (Dashboard or Page) DRY. Context that needs to persist across pages lives in _app.tsx 
const Providers = ({ children }: IProps) => (
  <LazyProvider>
    <ModalProvider>
      <NavProvider>
        { children }
      </NavProvider>
    </ModalProvider>
  </LazyProvider>
);

export default Providers;
