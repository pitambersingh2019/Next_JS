import { useContext } from 'react';
import DefaultAvatar from './DefaultAvatar';
import { SpaceContext } from '_context';
import { globals } from '_utils';
import styles from './UserAvatar.module.scss';

interface ICustom {
  avatar: IImage;
}

interface IProps {
  avatar?: IImage
  classes?: string;
}

const CustomAvatar = ({ avatar }: ICustom) => {

  const { src, alt } = avatar;

  return (
    <img src={globals.defaultSrc}
      data-src={src} 
      alt={alt}
      className="b-lazy" />
  );

};

const UserAvatar = ({ avatar: customAvatar, classes }: IProps) => {

  const { space, hasSpaceData } = useContext(SpaceContext);
  const { user } = space;
  const { avatar: userAvatar } = user;

  return (
    <figure className={`${styles.root}${classes ? ' ' + classes : ''}`}>
      {customAvatar ? (
        customAvatar?.src ? (
          <CustomAvatar avatar={customAvatar} />
        ) : (
          <DefaultAvatar user={user} />
        )
      ) : (
        hasSpaceData && (
          userAvatar?.src ? (
            <CustomAvatar avatar={userAvatar} />
          ) : (
            <DefaultAvatar user={user} />
          )
        )
      )}
    </figure>
  );

};

export default UserAvatar;
