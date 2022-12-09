import { Chevron } from '_vectors';
import styles from './SortableTable.module.scss';
import { ReactNode } from 'react';

interface IProps {
  controls: IControl[];
  active?: string;
  ascending?: boolean;
  classes?: string;
  children: ReactNode;
  emitSort?: (metric: string, method: SortMethodType) => void;
}

// used to render the header for a table with sorting functionality, button clicks are emitted to be handled in the parent component 
const SortableTable = ({ controls, active, ascending, classes, children, emitSort }: IProps) => (
  <table className={`table--dashboard${classes ? ' ' + classes : ''}`}>
    <thead>
      <tr>
        {controls.map(({ text, metric, method }, i) => (
          <th key={`${text}-${i}`}
            className="text--small">
            {metric ? (
              <button className={`${styles.control}${metric === active ? ' ' + styles.active : ''} ${ascending ? styles.ascending : styles.descending} text--small`} 
                onClick={() => emitSort && emitSort(metric, method || 'order')}>
                { text }
                <Chevron />
              </button>
            ) : <span className={styles.static}>{ text }</span>}
          </th>
        ))}
      </tr>
    </thead>
    { children }
  </table>
);

export default SortableTable;
