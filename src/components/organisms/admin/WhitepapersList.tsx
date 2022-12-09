import { useEffect, useState } from 'react';
import { Card, Error } from '_atoms';
import { useFetch } from '_hooks';
import styles from './WhitepapersList.module.scss';

interface IWhitepaper {
  categories: string[];
  downloadUrl: string;
  name: string;
  summary: string;
}

// used to render a list of whitepapers 
const WhitepapersList = () => {

  const { env, error, errorMessage, fetchData } = useFetch();
  const [whitepapers, setWhitepapers] = useState<IWhitepaper[] | null>(null);

  useEffect(() => {

    // fetch the list of whitepapers uploaded to the company in Umbraco
    if (env) {

      fetchData('/whitepapers/all').then(response => {

        if (response && response.length) setWhitepapers(response);

      });

    }

  }, [env]);

  return (
    whitepapers && whitepapers.length > 0 ? (
      <Card heading="Knowledge hub"
        icon="whitepaper"
        loading={!whitepapers}
        classes={`${styles.root} dashboard-single`}>
        <p className="text--medium">Our collection of in-depth reports on employee engagement and welfare, available to download</p>
        <div className={styles.grid}>
          {whitepapers?.map(({ categories, downloadUrl, name, summary }, i) => (
            <div key={`${name}-${i}`}
              className={styles.card}>
              <h2 className="text--body">
                <a href={downloadUrl}>{ name }</a>
              </h2>
              <p className="text--medium">{ categories.join(', ') }</p>
              <p className="text--medium">{ summary }</p>
            </div>
          ))}
        </div>
      </Card>
    ) : (
      <Error message={`${errorMessage} (${error})`}
        expanded={!!error}
        persist={true} />
    )
  );

};

export default WhitepapersList;
