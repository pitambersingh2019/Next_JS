import { MouseEvent } from 'react';
import { useRouter } from 'next/router';
import TagManager from 'react-gtm-module';
import useWindow from './useWindow';

interface ITrack {
  event: string;
  eventCategory: string;
  eventAction: string;
  eventLabel: string;
}

// used to extract common GTM tracking code away from components 
const useTracking = () => {

  const router = useRouter();
  const { asPath } = router;
  const { hasWindow } = useWindow();

  // standard event tracking
  const trackEvent = (category = '', action = '', label?: string): ITrack => {

    const obj = {
      event: 'Tracking',
      eventCategory: category,
      eventAction: action,
      eventLabel: label ? label : asPath
    };

    TagManager.dataLayer({
      dataLayer: obj
    });

    return obj;

  };

  // used to track something like a social media link click before taking the user to their target location
  const trackEventAndNavigate = (e: MouseEvent, href: string, category = '', action = '', label?: string): void => {

    e.preventDefault();

    trackEvent(category, action, label);

    if (hasWindow) window.location.href = href;

  };

  return {
    trackEvent,
    trackEventAndNavigate
  };

};

export default useTracking;
