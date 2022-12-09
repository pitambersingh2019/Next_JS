import { ReactNode } from 'react';
import SwiperClass from 'swiper/types/swiper-class';
import { NextPrev } from '_atoms';
import styles from './Pagination.module.scss';

interface IProps {
  slider?: SwiperClass;
  length: number;
  active: number;
  atStart: boolean;
  atEnd: boolean;
  classes?: string;
  children?: ReactNode;
}

// used to render arrow buttons for sliders & paginated content
const Pagination = ({ slider, length, active, atStart, atEnd, classes, children }: IProps) => (
  <nav className={`${styles.root}${classes ? ' ' + classes : ''}`}>
    {slider && (
      <ul>
        <li>
          <NextPrev disable={atStart}
            isPrev={true}
            emitClick={() => slider?.slidePrev()} />
        </li>
        <li className="text--small">{ active + 1 } of { length }</li>
        { children && children }
        <li>
          <NextPrev disable={atEnd}
            isPrev={false}
            emitClick={() => slider?.slideNext()} />
        </li>
      </ul>
    )}
  </nav>
);

export default Pagination;
