import { ReactNode } from 'react';
import styles from './Hidden.module.scss';

interface IProps {
  expanded: boolean;
  classes?: string;
  children: ReactNode;
}

// generic wrapper component
const Hidden = ({ expanded, classes, children }: IProps) => (
  <nav className={`${styles.root}${expanded ? ' ' + styles.shown : ''}${classes ? ' ' + classes : ''}`}>
    { children }
  </nav>
);

export default Hidden;
