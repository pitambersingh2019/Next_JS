import { forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import styles from './Button.module.scss';

interface IProps {
  target?: string;
  text: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  prominence?: 'primary' | 'secondary' | 'alt' | 'range';
  disabled?: boolean;
  newTab?: boolean;
  classes?: string;
  isFilter?: boolean;
  emitClick?: (() => void) | undefined;
  children?: ReactNode;
}

const Button = ({ target, text, type = 'button', prominence = 'secondary', disabled = false, newTab = false, classes, isFilter = false, emitClick, children }: IProps, ref: any) => {

  const classNames = `${styles.root} ${styles[prominence]}${classes ? ' ' + classes : ''}${isFilter ? ' ' + styles.active : ''}`;

  return (
    target ? (
      target.startsWith('http') || target.startsWith('#') ? (
        <a ref={ref} 
          href={target}
          target={newTab ? '_blank' : undefined}
          rel="noreferrer"
          className={classNames}> 
          { text } 
          { children && children } 
        </a>
      ) : (
        <Link href={target}> 
          <a ref={ref} 
            className={classNames}> 
            { text }
            { children && children }
          </a>
        </Link>
      )
    ) : (
      <button ref={ref} 
        type={type}
        className={classNames}   
        disabled={disabled}
        onClick={emitClick}>
        { text }
        { children && children }
      </button>
    )
  );

};

export default forwardRef(Button);
