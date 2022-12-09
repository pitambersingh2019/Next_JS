import { useEffect, useState } from 'react';
import { delay } from '_utils';
import styles from './DonutChart.module.scss';

interface IProps {
  total: number
}

// used to render the donut chart graphs used on the admin dashboard
const DonutChart = ({ total }: IProps) => {

  const [degree, setDegree] = useState<string>('0deg');
  const [shown, setShown] = useState<boolean>(false);

  useEffect(() => {

    // calcualte degree angle to be passed as CSS var 
    const value = 3.6 * total;

    // store in local state
    setDegree(`${value}deg`);
  
    // give a slight visual delay to allow the animation to properly play 
    delay(500).then(() => setShown(true));

  }, []);

  return (
    <div style={{ ['--degree' as string]: degree }}
      className={`${styles.root}${shown ? ' ' + styles.shown : ''}`}>
      <figure className={styles.chart}>Chart</figure>
      <div className={styles.inner}>
        <h2 className="h3">{ total }%</h2>
        <span>responded</span>
      </div>
    </div>
  );

};

export default DonutChart;
