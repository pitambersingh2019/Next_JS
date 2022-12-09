import { useContext, useEffect, useState } from 'react';
import { Expander } from '_molecules';
import { Cross } from '_vectors';
import { SpaceContext } from '_context';
import { useFetch } from '_hooks';
import styles from './PraiseBanner.module.scss';

interface IBadge {
  item: IPraise;
}

const storageItem = 'closedPraiseID';

// extracted here to allow prop destructuring
const Badge = ({ item }: IBadge) => {

  const { badge, from, message } = item;
  const { src, alt } = badge;

  return (
    <div className={styles.badge}>
      <img src={src} 
        alt={alt} />
      <h3 className="text--medium">
        { message } <small className="text--small">- { from }</small>
      </h3>
    </div>
  );

};

// used to display a praise banner in the dashboard (both admin & employee). The user can then dismiss it which animates out & stores the praise ID in localStorage to avoid showing again 
const PraiseBanner = () => {

  const { env, fetchData } = useFetch();
  const { space } = useContext(SpaceContext);
  const [praise, setPraise] = useState<IPraise | null>(null);
  const [shown, setShown] = useState<boolean>(false);
  const { primaryColour } = space.branding;

  useEffect(() => {

    if (env) {

      // fetch recent praise for user (identified via login cookie)
      fetchData('/praise/recent').then(response => {

        if (response) setPraise(response);

        // animate in banner if the new praise is different to the last dismissed 
        if (localStorage.getItem(storageItem) !== response?.id) setShown(true);

      });

    }

  }, [env]);

  // handle clicking of dismiss button 
  const hideBanner = (id: number) => {
    
    // store praise ID
    localStorage.setItem(storageItem, `${id}`);

    // animate out banner
    setShown(false);

  }; 

  return (
    <Expander expanded={shown}>
      {praise && praise.badge && (
        <aside className={`${styles.root}${primaryColour ? ' ' + styles.custom : ''}`}>
          <div className={`${styles.inner} inner`}>
            <Badge item={praise} />
            <button className={styles.close}
              aria-label="Close"
              onClick={() => hideBanner(praise.id)}>
              <Cross /> 
            </button>
          </div>
        </aside>
      )}
    </Expander>
  );

};

export default PraiseBanner;