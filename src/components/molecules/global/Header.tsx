import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProsperExLogo } from '_vectors';
import { addTrailingSlash } from '_utils';
import styles from './Header.module.scss';

interface IProps {
  content: ILink[];
  background: boolean;
}

// header for marketing site
const Header = ({ content, background }: IProps) => {

  const { asPath } = useRouter();

  return (
    <header className={`${styles.root}${background ? ' ' + styles.background + ' background' : ''}${asPath === '/' ? ' ' + styles.hero : ''}`}>
      <div className="inner">
        <Link href="/">
          <a className={styles.logo} 
            aria-label="Prosper EX">
            <ProsperExLogo />
          </a>
        </Link>
        <nav className={styles.nav}>
          <ul>
            {content.map(({ text, target }, i) => (
              <li key={`${text}-${i}`}>
                {target.startsWith('#') ? (
                  <a href={target}
                    className={`${styles.link} h5`}>
                    { text }
                  </a>
                ) : (
                  <Link href={target}>
                    <a className={`${addTrailingSlash(asPath) === addTrailingSlash(target) ? styles.active + ' ' : ''}${styles.link} h5`}>
                      { text }
                    </a>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );

};

export default Header;
