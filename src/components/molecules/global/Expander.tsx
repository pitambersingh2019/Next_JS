import { ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Expander.module.scss';

interface IProps {
  expanded: boolean;
  delay?: number;
  duration?: number;
  children: ReactNode;
  emitComplete?: () => void;
}

// used as an animated accordion item, using GSAP to transition an element from its natural height to 0 & vice versa 
const Expander = ({ expanded, delay = 0, duration = 0.3, children, emitComplete }: IProps) => {

  const expanderRef = useRef<HTMLDivElement>(null);
  const tl = useRef(gsap.timeline({ paused: true }));

  // set up our tween, based on values passed in via props (which have generic defaults)
  const tween = {
    height: 0,
    duration,
    delay,
    ease: 'power3.inOut'
  };

  useEffect(() => {

    if (expanded) {

      // to show content, set its height to auto & then immediately animate FROM 0 (which is set in the CSS). GSAP works out the rest 
      gsap.set(expanderRef.current, { height: 'auto' });

      tl.current
        .from(expanderRef.current, {
          ...tween,
          onComplete: () => gsap.set(expanderRef.current, { height: 'auto' })
        })
        .play();

    } else {

      // to hide content, we're simply animating TO 0 
      tl.current
        .to(expanderRef.current, {
          ...tween,
          clearProps: true,
          onComplete: () => emitComplete && emitComplete()
        })
        .play();

    }

  }, [expanded]);

  return (
    <div ref={expanderRef}
      className={styles.root}>
      { children }
    </div>
  );

};

export default Expander;
