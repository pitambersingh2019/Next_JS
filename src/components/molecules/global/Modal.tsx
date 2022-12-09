import { ReactNode, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Cross } from '_vectors';
import { delay } from '_utils';

interface IProps {
  launch: boolean;
  button?: boolean;
  classes?: string;
  emitClose?: () => void;
  children: ReactNode;
}

const bodyClass = 'block-scroll';
const duration = 0.25;

const tween = {
  autoAlpha: 1,
  duration,
  ease: 'power2.inOut'
};

// generic component used for all modals, animated with GSAP 
const Modal = ({ launch, button = true, classes, emitClose, children }: IProps) => {

  const tl = useRef(gsap.timeline({ paused: true }));
  const bgRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState<boolean>(false);

  useEffect(() => {

    // configure GSAP timeline 
    tl.current
      .to(rootRef.current, {
        ...tween,
        scale: 1,
        onStart: () => gsap.set(bgRef.current, { visibility: 'visible' }),
        onReverseComplete: () => {

          gsap.set(rootRef.current, { clearProps: true });
          
          if (bgRef.current) gsap.set(bgRef.current, { clearProps: true });

          emitClose && emitClose();

        }
      })
      .reverse();

  }, []);

  useEffect(() => {

    // play timeline & fire animation, direction decided dynamically 
    tl.current.reversed(!shown);

    // when modal is shown, add class to body to ensure page behind doesn't scroll
    shown
      ? document.documentElement.classList.add(bodyClass)
      : delay(duration * 1000).then(() => document.documentElement.classList.remove(bodyClass));

  }, [shown]);

  useEffect(() => {
    
    // show modal when parent says to
    setShown(launch);

  }, [launch]);

  return (
    <aside ref={rootRef}
      className={classes ? classes : ''}>
      <section className="modal__inner">
        <span ref={bgRef}
          className="modal__bg"
          onClick={() => setShown(false)} />
        {button && (
          <button className="modal__close"
            aria-label="Close"
            onClick={() => setShown(false)}>
            <Cross /> 
          </button>
        )}
        { children }
      </section>
    </aside>
  );

};

export default Modal;
