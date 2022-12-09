import { UserAvatar } from '_atoms';
import styles from './FeedActivity.module.scss';

// used to display an activity item in the employee's activity feed
const FeedActivity = ({ avatar, liker, sender }: IFeedItem) => (
  <li className={styles.root}>
    <UserAvatar avatar={avatar}
      classes={styles.avatar} />
    <span className="text-medium">{ liker } liked the praise you received from { sender }</span>
  </li>
);

export default FeedActivity;

