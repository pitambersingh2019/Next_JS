import { useContext, useEffect, useState } from 'react';
import { useFetch } from '_hooks';
import { SpaceContext } from '_context';
import styles from './SelectBadge.module.scss';

interface IProps {
  refresh: number;
  emitDefault?: (badge: IBadge) => void;
  emitSelect: (badge: IBadge) => void;
}

// used to display praise badges in a grid. Events are emitted to be handled in parent component (PraiseWidget or PraiseEmployee)
const SelectBadge = ({ refresh, emitDefault, emitSelect }: IProps) => {

  const { env, fetchData } = useFetch();
  const { hasSpaceData } = useContext(SpaceContext);
  const [badges, setBadges] = useState<IBadge[]>([]);
  const [selected, setSelected] = useState<IBadge | null>(null);

  // handle the user selecting a badge
  const handleSelect = (badge: IBadge) => {

    // animates other badges to shrink
    setSelected(badge);
    // emit the selected badge to the parent
    emitSelect(badge);

  };

  useEffect(() => {

    // get the badges from the API
    if (env && hasSpaceData) fetchData('/praise/types').then(response => setBadges(response));

  }, [env, hasSpaceData]);

  useEffect(() => {

    // let the parent component optionally know what the first badge is
    if (badges && emitDefault) emitDefault(badges[0]);

  }, [badges, refresh]);

  return (
    <ul className={styles.root}>
      {badges?.length > 0 && badges?.map((item, i) => {
        
        const { id, name, badge } = item;
        const { src, alt } = badge;

        return (
          <li key={`${name}-${i}`}
            className={selected && selected?.id !== id ? styles.inactive : undefined}>
            <button className={styles.badge}
              onClick={() => handleSelect(item)}>
              <img src={src} 
                alt={alt || name} />
            </button>
            <span className="text--small">{ name }</span>
          </li>
        );

      })}
    </ul>
  );

};

export default SelectBadge;
