import { useTracking, useVector } from '_hooks';
import styles from './Networks.module.scss';

interface IProps {
  networks: INetwork[];
  track?: boolean;
  classes?: string;
}

interface IVector {
  network: INetwork;
  track: boolean;
}

// used to render the button, extracted here to make use of useVector hook
const Icon = ({ network, track }: IVector) => {

  const { id, url } = network;
  const { trackEventAndNavigate } = useTracking();
  const Vector = useVector(id);

  return Vector ? (
    <li>
      <a href={url} 
        className={`icon--${id}`}
        rel="noopener noreferrer"
        aria-label={id}
        onClick={(e) => track && trackEventAndNavigate(e, url, 'Social', 'Share')}>
        <Vector />
      </a>
    </li>
  ) : null;

};

// used to render social network links
const Networks = ({ networks, track = false, classes }: IProps) => (
  <nav className={`${styles.root}${classes ? ' ' + classes : ''}`}>
    <ul>
      {networks && networks.map((network, i) => (
        <Icon key={`${network.id}-${i}`}
          network={network}
          track={track} />
      ))}
    </ul>
  </nav>
);

export default Networks;
