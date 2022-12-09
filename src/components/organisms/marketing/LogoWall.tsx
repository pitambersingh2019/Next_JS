import { globals } from '_utils';
import styles from './LogoWall.module.scss';

interface IItem {
  image: IImage;
  url: string;
}

interface IContent {
  heading: string;
  items: IItem[];
}

export interface IProps {
  content: IContent;
}

// simple display component
const LogoWall = ({ content }: IProps) => {

  const { heading, items } = content;

  return (
    <section className={styles.root}>
      <div className="inner">
        <h2>{ heading }</h2>
        <div className={styles.grid}>
          {items.map(({ image, url }, i) => {

            const { src, alt } = image;

            return (
              <a key={`${url}-${i}`}
                href={`${!url.startsWith('http') ? 'https://' : ''}${url}`}
                target="_blank"
                className={styles.company}
                rel="noreferrer">
                <figure>
                  <img src={globals.defaultSrc}
                    data-src={src}
                    alt={alt}
                    sizes="(min-width: 1300px) 7vw, (min-width: 750px) 98px, 42vw"
                    className="b-lazy" />
                </figure>
              </a>
            );

          })}
        </div>
      </div>
    </section>
  );

};

export default LogoWall;
