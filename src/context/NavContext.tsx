import { createContext } from 'react';

const NavContext = createContext({
  navOpen: false,
  openNav: () => {},
  closeNav: () => {}
});

export default NavContext;
