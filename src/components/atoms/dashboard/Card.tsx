import { MouseEvent, ReactNode } from 'react';
import { useVector } from '_hooks';
import styles from './Card.module.scss';

interface IProps {
  heading: string;
  icon?: IconType;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  classes?: string;
  emitClick?: (e: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}

const Card = ({ heading, icon, loading = true, error = false, errorMessage, classes, emitClick, children }: IProps) => {

  const Vector = useVector(icon);

  return (
    <article className={`${styles.root}${icon && styles[icon] ? ' ' + styles[icon] : ''}${classes ? ' ' + classes : ''} card spinner${loading ? ' spinning' : ''}`}
      onClick={(e) => emitClick && emitClick(e)}>
      {icon ? (
        <h2 className="h4">
          <span className={`${styles.icon} icon-wrapper`}>{Vector && <Vector />}</span>
          { heading }
        </h2>
      ) : (
        <h1 className="h3">{ heading }</h1>
      )}
      { error ? <p className={`${styles.error}${classes?.includes('--table') ? ' padded' : ''}`}>{ errorMessage ? errorMessage : 'There was a problem getting the data from the server. Please try again later.' }</p> : children }
    </article>
  );

};

export default Card;
