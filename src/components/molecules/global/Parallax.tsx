import { ReactNode, useEffect, useRef } from 'react';
import * as basicScroll from 'basicscroll';
import { useWindow } from '_hooks';

interface IProps {
  from?: string;
  to?: string;
  classes?: string;
	children: ReactNode;
}

// used to wrap a component with a basicScroll-powered parallax setup (which adds CSS vars to the target element which you can then base animations from in the Sass)
const Parallax = ({ from, to, classes, children }: IProps) => {

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { hasWindow } = useWindow();

  useEffect(() => {

    if (hasWindow) {

      basicScroll.create({
        elem: wrapperRef.current,
        from: from ? from : 'top-middle',
        to: to ? to : 'bottom-middle',
        direct: true,
        props: {
          '--scroll': {
            from: 0.001,
            to: 0.999
          }
        }
      }).start();

    }

  }, []);

  return (
    <section ref={wrapperRef} 
      className={classes}>
      { children }
    </section>
  );

};

export default Parallax;
