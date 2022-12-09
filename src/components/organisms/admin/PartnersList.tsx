import { useEffect, useState } from 'react';
import { Card, Error } from '_atoms';
import { useFetch } from '_hooks';
import styles from './PartnersList.module.scss';

interface IPartner {
  image: IImage;
  logo: IImage;
  name: string;
  text: string;
}

// used to render employee rewards 
const PartnersList = () => {
  
  const { env, error, errorMessage, fetchData } = useFetch();
  const [partners, setPartners] = useState<IPartner[]>([]);

  useEffect(() => {

    if (env) {

      fetchData('/partners/all').then(response => {

        if (response && response.length) setPartners(response);

      });

    }

  }, [env]);

  return (
    partners && partners.length > 0 ? (
      <Card heading="Employee rewards"
        icon="discount"
        loading={!partners.length}
        classes={`${styles.root} dashboard-single dashboard-single--wide`}>
        {partners?.map(({ image, name, text }, i) => {
    
          const { src, alt } = image;

          return (
            <div key={`${name}-${i}`}
              className={styles.grid}>
              <div className={styles.content}>
                <h2>{ name }</h2>
                <div dangerouslySetInnerHTML={{ __html: text }} />
              </div>
              <figure>
                <img src={src} 
                  alt={alt} />
              </figure>
            </div>
          );
          
        })}
      </Card>
    ) : (
      <Error message={`${errorMessage} (${error})`}
        expanded={!!error}
        persist={true} />
    )
  );

};

export default PartnersList;