import userImg from '_assets/icons/avatar.svg';
import { globals } from '_utils';
import styles from './DefaultAvatar.module.scss';

interface IProps {
  user: IUser;
}

const DefaultAvatar = ({ user }: IProps) => (
  <div className={styles.root}>
    <img src={globals.defaultSrc} 
      data-src={userImg} 
      alt={user?.name}
      className="b-lazy" />
    <span className={`${styles.initials} h2`}>{ user?.initials }</span>
  </div>
);

export default DefaultAvatar;
