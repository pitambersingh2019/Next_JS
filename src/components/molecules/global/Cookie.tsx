import { useState } from 'react';
import Link from 'next/link';
import CookieConsent from 'react-cookie-consent';
import styles from './Cookie.module.scss';
import button from './../../atoms/buttons/Button.module.scss';

// used to render a cookie consent banner 
const Cookie = () => {

  const [hidden, setHidden] = useState<boolean>(false);

  return (
    <CookieConsent expires={30}
      containerClasses={`${styles.root} admin banner${hidden ? ' banner--hidden' : ''}`}
      hideOnAccept={false}
      enableDeclineButton={true}
      disableStyles={true}
      location="none"
      buttonClasses={`${button.root} ${button.secondary}`}
      buttonText="Allow cookies"
      declineButtonClasses="h6"
      declineButtonText="Decline"
      onAccept={() => setHidden(true)}
      onDecline={() => setHidden(true)}>
      <strong>
        This website uses cookies to improve your experience.
        <Link href="/cookie-policy">
          <a>
            Learn more
          </a>
        </Link>
      </strong>
    </CookieConsent>
  );

};

export default Cookie;
