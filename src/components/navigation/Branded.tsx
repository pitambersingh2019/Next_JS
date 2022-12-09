import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Notification, Restricted, UserAvatar } from '_atoms';
import Hidden from './Hidden';
import { SpaceContext } from '_context';
import { Chevron, ProsperExLogo } from '_vectors';
import { useAuth, useExpanded } from '_hooks';
import { addTrailingSlash } from '_utils';
import styles from './Branded.module.scss';

// used to render the generic dashboard nav (both admin-side & employee-side)
const Branded = () => {

  const { asPath } = useRouter();
  const { logOut } = useAuth();
  const { expanded, toggleExpanded, handleClick } = useExpanded();
  const { space } = useContext(SpaceContext);
  const { branding, user } = space;
  const { primaryColour, logo } = branding;
  const { firstName, notifications } = user;

  return (
    <div className={`${styles.root} ${primaryColour ? styles.custom : styles.default}${expanded ? ' ' + styles.expanded : ''}`}
      onClick={(e) => handleClick(e)}>
      <div className="inner">
        <Link href="/">
          <a className={styles.logo}>
            {logo && logo.src ? (
              <img src={logo.src} 
                alt={logo.alt} />
            ) : (
              <ProsperExLogo />
            )}
          </a>
        </Link>
        <Restricted allow={['Admin']}>
          <nav className={styles.visible}>
            <ul>
              <li>
                <Link href="/">
                  <a className={`${addTrailingSlash(asPath) === '/dashboard/' ? styles.active + ' ' : ''}${styles.link} h5`}>Employee dashboard</a>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <a className={`${addTrailingSlash(asPath) === '/admin/' ? styles.active + ' ' : ''}${styles.link} h5`}>Management dashboard</a>
                </Link>
              </li>
            </ul>
          </nav>
        </Restricted>
        <button className={styles.user}
          onClick={toggleExpanded}>
          <UserAvatar classes={styles.avatar} />
          {notifications > 0 && <Notification pings={notifications} />}
          <span className="h5">{ firstName }</span>
          <Chevron />
        </button>
        <Hidden classes={styles.hidden}
          expanded={expanded}>
          <ul>
            <Restricted allow={['Admin']}>
              <>
                <li className={styles.moved}>
                  <Link href="/">
                    <a className={`${styles.link} h5`}>Employee dashboard</a>
                  </Link>
                </li>
                <li className={styles.moved}>
                  <Link href="/admin">
                    <a className={`${styles.link} h5`}>Management dashboard</a>
                  </Link>
                </li>
              </>
            </Restricted>
            <li className={styles.notification}>
              {notifications > 0 && <Notification pings={notifications} />}
              <Link href="/feed">
                <a className={`${styles.link} h5`}>My Activity</a>
              </Link>
            </li>
            <li>
              <Link href="/profile">
                <a className={`${styles.link} h5`}>My profile</a>
              </Link>
            </li>
            <li>
              <button className={`${styles.link} h5`} 
                onClick={() => logOut('')}>
                Log out
              </button>
            </li>
          </ul>
        </Hidden>
      </div>
    </div>
  );

};

export default Branded;
