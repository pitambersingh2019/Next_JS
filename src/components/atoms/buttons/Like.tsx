import { useContext, useState } from 'react';
import { SpaceContext } from '_context';
import { useFetch } from '_hooks';
import styles from './Like.module.scss';

interface IProps {
  liked: number[];
  praiseId: string;
}

const Like = ({ liked, praiseId }: IProps) => {

  const { space } = useContext(SpaceContext);
  const { id: userId } = space.user;
  const { fetchData } = useFetch();
  const [count, setCount] = useState<number>(liked.length);
  const [isLiked, setIsLiked] = useState<boolean>(liked.includes(userId));
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
 
  const handleLike = () => {

    setCount(count + 1);
    setIsLiked(true);
    setIsDisabled(true);

    fetchData(`/praise/like/${praiseId}`).then(response => {

      if (response?.liked) setIsDisabled(false);
  
    }); 
    
  };
  
  const handleUnlike = () => {

    setCount(count - 1);
    setIsLiked(false);
    setIsDisabled(true);

    fetchData(`/praise/unlike/${praiseId}`).then(response => {

      if (response?.unliked) setIsDisabled(false);
  
    }); 
    
  };
  
  return (
    <button className={`${styles.like}${isLiked ? ' ' + styles.unlike : ''} text--medium text-link`}
      onClick={!isLiked ? handleLike : handleUnlike}
      disabled={isDisabled}>
      <span>{isLiked ? 'Unlike' : 'Like'} ({ count })</span>
    </button>
  );

};

export default Like;
