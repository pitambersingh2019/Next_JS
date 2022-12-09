import { Like } from '_atoms';
import styles from './FeedPraise.module.scss';

// used to show a praise item in the employee's activity feed, allowing them to like or unlike it
const FeedPraise = ({ id, badge, receiver, message, liked, sender }: IFeedItem) => (
  <li className={styles.root}>
    <img className={styles.badge}
      src={badge?.src}
      alt={badge?.alt} />
    <div className={styles.wrapper}>
      <span className="text-medium">{ sender } praised { receiver }</span>
      <span className={`${styles.message} text--small`}>{ message }</span>       
    </div>
    <Like liked={liked ?? []}
      praiseId={id} /> 
  </li>
);

export default FeedPraise;
