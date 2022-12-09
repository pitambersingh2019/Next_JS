import { RefObject, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface IProps {
  wrapper: RefObject<HTMLDivElement>;
  tab: RefObject<HTMLElement>;
  hide: boolean;
  forward: boolean;
  first?: boolean;
  children: JSX.Element;
}

const tween = { 
  duration: 0.3, 
  ease: 'power2.inOut'
};

// used for any tabbed content - both for the incoming and outgoing tab - animated with GSAP
const Tab = ({ wrapper, tab, forward, hide, first = false, children }: IProps) => {

  const tl = useRef(gsap.timeline({ paused: true }));
  const firstRender = useRef(true);

  // there is a slight horizontal animation; we have incoming, outgoing, forward & backward scenarios to cover. This method works out what value to use in the transform 
  const getAnimValue = () => {
  
    let value = null;
  
    switch (true) {
  
      case (!hide && forward)
        || (hide && !forward):
        value = 20;
        break;
  
      case (hide && forward)
        || (!hide && !forward):
        value = -20;
        break;
  
      default:
        value = 0;
        break;
  
    }

    return value;

  };

  useEffect(() => {

    // get old height of wrapper before anything else happens 
    const oldHeight = wrapper.current?.scrollHeight;

    if (firstRender.current) {

      // ensure first tab is always shown
      if (first) gsap.set(tab.current, { opacity: 1, visibility: 'visible', display: 'block' });

      // set to false so this block is skipped next time
      firstRender.current = false;

    } else {

      // ensure the tab sits in the same position as its sibling 
      gsap.set(tab.current, { position: 'absolute' });

      const animValue = getAnimValue();

      if (hide) {

        // if outgoing, fade the tab out & animate to whatever the animValue was calculated to be, e.g. this would be 20px to the left 
        tl.current
          .to(tab.current, {
            autoAlpha: 0,
            x: animValue,
            clearProps: 'display,opacity,visibility,position',
            ...tween
          });
  
      } else {
  
        gsap.set(tab.current, { display: 'block' });
  
        // get height of incoming tab 
        const newHeight = tab.current?.scrollHeight;
  
        // animate wrapper height to match that of incoming tab
        tl.current
          .fromTo(wrapper.current, {
            height: oldHeight
          }, {
            height: newHeight,
            ...tween,
            delay: 0.15
          });
  
        // if incoming, fade the tab in & animate from whatever the animValue was calculated to be, e.g. this would be 20px from the right  
        tl.current
          .fromTo(tab.current, {
            autoAlpha: 0,
            x: animValue
          }, {
            autoAlpha: 1,
            x: 0,
            clearProps: 'position',
            onComplete: () => gsap.set(wrapper.current, { clearProps: 'height' }),
            ...tween
          });
  
      }
  
      tl.current.play();

    }

  }, [hide]);

  return children;

};

export default Tab;
