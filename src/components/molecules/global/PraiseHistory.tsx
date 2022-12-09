import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from '_navigation';
import { useFetch, useSlider, useWindow } from '_hooks';
import { chunk, delay, globals } from '_utils';
import styles from './PraiseHistory.module.scss';

interface IBadges {
  items: IPraise[];
}

interface IProps {
  memberId?: string | string[];
  memberName?: string;
  classes?: string;
}

const { shortDate } = globals;

const chunkSize = 12;

const Badges = ({ items }: IBadges) => (
  <ul className={styles.badges}>
    {items?.map(({ badge, createDate, from, message }, i) => (
      <li key={`${from}-${i}`} 
        className={styles.badge}>
        <img src={badge.src} 
          alt={badge.alt} />
        <h3 className="text--medium">{ message }</h3>
        <small className="text--small">
          <span>{ from },</span>
          <span>{ dayjs(createDate).format(shortDate) }</span>
        </small>
      </li>
    ))}
  </ul>
);

// used in various places to show a history of praise received by a user (either current on employee-side or of a team member on admin-side)
const PraiseHistory = ({ memberId, classes }: IProps) => {

  const { env, fetchData } = useFetch();
  const router = useRouter();
  const { hasWindow } = useWindow();
  const { slider, activeSlide, atStart, atEnd, setSlider, setAtStart, setAtEnd, handleSlideChange } = useSlider();
  const praiseRef = useRef<HTMLDivElement>(null);
  const [badges, setBadges] = useState<IPraise[]>([]);
  const [chunks, setChunks] = useState<IPraise[][]>([]);
  const [isChunked, setIsChunked] = useState<boolean>(false);

  useEffect(() => {

    // enable next button if we have more than one slide 
    if (chunks.length > 0) setAtEnd(false);

  }, [chunks]);

  useEffect(() => {

    // if paginated, store the slides locally 
    if (isChunked) setChunks(chunk(badges, chunkSize));

  }, [isChunked]);

  useEffect(() => {

    // if praise to show, work out whether to paginate (chunk)
    if (badges.length) setIsChunked(badges.length > chunkSize);

  }, [badges]);

  useEffect(() => {

    if (env) {

      // by default, we just want the current user's praise for EmployeeProfile (identified by login cookie)
      let endpoint = '/praise/received';

      // optionally, we can define a user to get praise for TeamProfile 
      if (memberId) endpoint += `/${memberId}`;

      fetchData(endpoint).then(response => {

        if (response[0]?.message) setBadges(response);

        // we can optionally smooth scroll the user to the praise component
        if (hasWindow && router.asPath.includes('#praise')) delay(250).then(() => praiseRef.current?.scrollIntoView({ behavior: 'smooth' }));
      
      });

    }

  }, [env]);

  return (
    <div ref={praiseRef}
      className={`${styles.root}${classes ? ' ' + classes : ''}`}>
      <h2 className="h4">Praise history</h2>
      {badges && badges.length > 0 ? (
        !isChunked ? (
          <Badges items={badges} />
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
                {chunks?.map((chunk: IPraise[], i: number) => (
                  <SwiperSlide key={`chunk-${i}`}>
                    <div className={styles.slide}>
                      <Badges items={chunk} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        )
      ) : (
        <p>No-one has praised {memberId ? 'this employee' : 'you'} yet</p>
      )}
    </div>
  );

};

export default PraiseHistory;
