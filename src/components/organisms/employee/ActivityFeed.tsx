import { useEffect, useContext, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { Card, Error } from '_atoms';
import { FeedActivity, FeedPraise } from '_molecules';
import { SpaceContext } from '_context';
import { Pagination } from '_navigation';
import { useFetch, useSlider } from '_hooks';
import { chunk } from '_utils';
import styles from './ActivityFeed.module.scss';

interface IFeed {
  items: IFeedItem[];
}

// number of items per slide
const chunkSize = 10;

// extracted out as there can be either a single feed list or a list per slide  
const Feed = ({ items }: IFeed) => (
  <ul>
    {items?.map(({ id, receiver, variant, message, badge, liked, sender, avatar, liker }, i) => (
      <> 
        {variant === 'activity' && liker && avatar && (
          <FeedActivity key={`${id}-${i}`}
            id={id}
            avatar={avatar} 
            liker={liker}
            sender={sender} />
        )} 
        {variant === 'praise' && receiver && message && badge && liked && (
          <FeedPraise key={`${id}-${i}`}
            id={id}  
            receiver={receiver}
            message={message}
            badge={badge} 
            liked={liked}
            sender={sender} />
        )}
      </>
    ))}
  </ul>
);

// used to render the employee's activity feed, which shows a list of either praise sent across the business or when a colleague 'likes' praise the current employee has received
const ActivityFeed = () => {

  const { env, error, errorMessage, fetchData } = useFetch();
  const { slider, activeSlide, atStart, atEnd, setSlider, setAtStart, setAtEnd, handleSlideChange } = useSlider();
  const { space, hasSpaceData, saveSpace } = useContext(SpaceContext);
  const { user } = space;
  const hasNotifications = user.notifications > 0;
  const [feedItems, setFeedItems] = useState<IFeedItem[] | null>(null);
  const [chunks, setChunks] = useState<IFeedItem[][]>([]);
  const [isChunked, setIsChunked] = useState<boolean>(false);

  useEffect(() => {

    // if we have paginated content, enable the next button
    if (chunks.length > 0) setAtEnd(false);

  }, [chunks]);

  useEffect(() => {

    // if we need to chunk (paginate), split the data into chunks of content
    if (isChunked) setChunks(chunk(feedItems, chunkSize));

  }, [isChunked]);

  useEffect(() => {

    // if we have items, work out whether we need to paginate
    if (feedItems?.length) setIsChunked(feedItems.length > chunkSize);

  }, [feedItems]);
 
  useEffect(() => {
    
    if (env) {

      // fetch the employee's activity feed data 
      fetchData('/praise/activity-feed').then(response => {

        if (response) setFeedItems(response);
    
      }); 

      // if the employee had notifications, we need to call the reset API 
      if (hasSpaceData && hasNotifications) {

        fetchData('/praise/seen').then(response => {

          // on success, overwrite the global space context with notifications as 0 - which will automatically update in all places subscribed to that data (e.g. in the avatar & dropdown nav)
          if (response && response.seen) saveSpace({ ...space, user: { ...space.user, notifications: 0 } });
      
        });
      
      }
    
    }

  }, [env, space]);

  return (
    <Card heading="Activity feed"
      icon="praise"
      loading={!feedItems}
      classes={`${styles.root} dashboard-single`}>
      {feedItems && feedItems.length ? (
        <>
          <Link href="/profile#praise">
            <a className={`${styles.praise} text-link text--small`}>See my praise</a>
          </Link>
          {feedItems.length < chunkSize ? (
            <div className={styles.slide}>
              <Feed items={feedItems} />
            </div>
          ) : (
            <>
              <Pagination slider={slider}
                length={chunks.length}
                active={activeSlide}
                atStart={atStart}
                atEnd={atEnd}
                classes={styles.pagination} />
              <div className={styles.slider}>
                <Swiper onInit={(slider) => setSlider(slider)}
                  onSlideChange={(slider) => handleSlideChange(slider)}
                  onReachBeginning={() => setAtStart(true)}
                  onReachEnd={() => setAtEnd(true)}>
                  {chunks?.map((chunk: IFeedItem[], i: number) => (
                    <SwiperSlide key={`${chunk[i]?.id ?? 'chunk'}-${i}`}>
                      <div className={styles.slide}>
                        <Feed items={chunk} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          )}
        </>
      ) : (
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error}
          persist={true} />
      )}
    </Card>
  );

};

export default ActivityFeed;