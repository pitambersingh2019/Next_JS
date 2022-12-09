import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '_navigation';
import { Button, Error } from '_atoms';
import { useFetch, useSlider } from '_hooks';
import { chunk } from '_utils';
import styles from './DiscountsWidget.module.scss';

dayjs.extend(relativeTime);

interface IBrand {
  colour: string;
  logo: IImage;
}

interface IDiscount {
  brand: IBrand;
  categories: string[];
  discountUrl: string;
  expiryDate: Date;
  name: string;
}

interface IDiscounts {
  items: IDiscount[];
}

interface IProps {
  classes?: string;
}

const chunkSize = 6;

// extracted here as can be used either singular or paginated in a slider 
const Discounts = ({ items }: IDiscounts) => (
  <div className={styles.grid}>
    {items?.map(({ brand, categories, discountUrl, expiryDate, name }, i) => {

      const { colour, logo } = brand;
      const { alt, src } = logo;

      return (
        <div key={`${name}-${i}`} 
          className={`${styles.card} card`}>
          <figure className={styles.logo}
            style={colour ? { ['--brand' as string]: colour } : undefined}>
            <img src={src} 
              alt={alt} />
          </figure>
          <h3 className="text--body">{name}</h3>
          <ul className={styles.info}>
            <li className={`${styles.category} text--small`}>{ categories }</li>
            {expiryDate && (
              <li className={`${styles.date}${dayjs().diff(expiryDate, 'days') > -14 ? ' ' + styles.danger : ''} text--small`}>
                { dayjs(expiryDate).fromNow(true) } left
              </li>
            )}
          </ul>
          <Button target={discountUrl}
            newTab={true}
            text="Get this deal"
            classes={styles.button} />
        </div>
      );

    })}
  </div>
);

// used on the employee dashboard to display different discounts available 
const DiscountsWidget = ({ classes }: IProps) => {

  const { env, error, errorMessage, fetchData } = useFetch();
  const { slider, activeSlide, atStart, atEnd, setSlider, setActiveSlide, setAtStart, setAtEnd, resetButtons, handleSlideChange } = useSlider();
  const [discounts, setDiscounts] = useState<IDiscount[]>([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState<IDiscount[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [categories, setCategories] = useState<string[]>(['']);
  const [isChunked, setIsChunked] = useState<boolean>(false);
  const [chunks, setChunks] = useState<IDiscount[][]>([]);

  // work out whether we need to paginate (chunk) the discounts 
  const needToChunk = (items: IDiscount[]): boolean => {

    const shouldChunk = items.length > chunkSize;

    if (shouldChunk) {

      setIsChunked(true);
      setChunks(chunk(items, chunkSize));

    } else {

      setIsChunked(false);

    }

    return shouldChunk;

  };

  // used to apply a filter 
  const filterAndChunk = (items: IDiscount[], category: string) => {

    setFilteredDiscounts(items);
    setActiveFilter(category);
    needToChunk(items);

  };

  // remove active filter 
  const revertFilters = () => filterAndChunk(discounts, '');

  // create new array of matched discounts based on the active category filter 
  const filterDiscounts = (category: string): boolean => {

    // if we don't have a category we need not go any further 
    if (!category) return false;

    // if it's a new filter, apply it - otherwise we're toggling the active one off so need to reset
    if (activeFilter !== category) {

      // match items in the discounts array to the active filter 
      const filteredDiscounts = discounts.filter(({ categories }) => categories.find(y => y === category));

      // if we have discounts to show, work out whether we need to chunk them
      if (filteredDiscounts.length) filterAndChunk(filteredDiscounts, category);

    } else {

      revertFilters();

    }

    return true;

  };

  useEffect(() => {

    // reset the slider to the first slide every time a subscribed value changes 
    if (slider) {

      resetButtons(slider);
      setActiveSlide(0);
      setAtStart(true);

    }

  }, [discounts, filteredDiscounts, chunks, slider]);

  useEffect(() => {

    // fetch all available discounts from the API
    if (env) {

      fetchData('/discounts/available').then(response => {

        if (response?.items && response?.categories) {

          const { items, categories } = response;

          setDiscounts(items);
          setFilteredDiscounts(items);
          setCategories(categories);
          needToChunk(items);

        }

      });

    }

  }, [env]);

  return (
    <article className={`${styles.root}${classes ? ' ' + classes : ''}`}>
      <h2>Your discounts and perks</h2>
      {filteredDiscounts && filteredDiscounts.length > 0 ? (
        <>
          <nav className={styles.nav}>
            <h3 className="text--small">Show category:</h3>
            <ul>
              <li>
                <button className={`${styles.filter} text--small text-link`}
                  onClick={revertFilters}
                  disabled={activeFilter === ''}>
                  All
                </button>
              </li>
              {categories?.map((category, i) => (
                <li key={`${category}-${i}`}>
                  <button className={`${styles.filter} ${activeFilter === category ? styles.active + ' ' : ''}text--small text-link`}
                    onClick={() => filterDiscounts(category)}>
                    { category }
                  </button>
                </li>
              ))}
            </ul>
            {isChunked && chunks.length && (
              <Pagination slider={slider}
                length={chunks.length}
                active={activeSlide}
                atStart={atStart}
                atEnd={atEnd}
                classes={styles.pagination} />
            )}
          </nav>
          {!isChunked ? (
            <Discounts items={filteredDiscounts} />
          ) : (
            <div className={styles.slider}>
              <Swiper onInit={(slider) => setSlider(slider)}
                onSlideChange={(slider) => handleSlideChange(slider)}
                onReachBeginning={() => setAtStart(true)}
                onReachEnd={() => setAtEnd(true)}>
                {chunks?.map((chunk: IDiscount[], i: number) => (
                  <SwiperSlide key={`chunk-${i}`}>
                    <div className={styles.slide}>
                      <Discounts items={chunk} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </>
      ) : (
        <Error message={`${errorMessage} (${error})`}
          expanded={!!error}
          persist={true} />
      )}   
    </article>
  );

};

export default DiscountsWidget;