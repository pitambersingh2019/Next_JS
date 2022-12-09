import { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

type ThemeType = 'employee' | 'admin';

interface IProps {
  global: IGlobalResponse;
  theme?: ThemeType;
  isHome?: boolean;
	children: ReactNode;
}

// used to house structural base layout elements in the Page component
const Layout = ({ global, theme = 'employee', isHome = false, children }: IProps) => {

  const [currentTheme, setCurrentTheme] = useState<ThemeType>(theme);
  const { json } = global;

  useEffect(() => {

    setCurrentTheme(theme);

  }, [theme]);

  return (
    <div className={`wrapper ${isHome ? 'home ' : ''}${currentTheme}`}>
      <Header content={json.nav.header} 
        background={currentTheme === 'admin'} />
      <main role="main">
        { children }
      </main>
      <Footer content={json}
        footerBlock={isHome} />
    </div>
  );

};

export default Layout;
