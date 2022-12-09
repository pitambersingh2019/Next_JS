import { Image } from '_molecules';
import styles from './ProductOverview.module.scss';

interface IItem {
  icon: IImage;
  heading: string;
  text: string;
}

interface IContent {
  image: IImage;
  heading: string;
  items: IItem[];
}

export interface IProps {
  content: IContent;
}

// define image sizes at different breakpoints
const queries: IQuery[] = [
  {
    device: 'mobile',
    dimensions: {
      min: {
        width: 140,
        height: 269
      },
      max: {
        width: 355,
        height: 225
      }
    }
  },
  {
    device: 'portrait',
    dimensions: {
      min: {
        width: 295,
        height: 379
      },
      max: {
        width: 420,
        height: 360
      }
    }
  },
  {
    device: 'landscape',
    dimensions: {
      min: {
        width: 440,
        height: 400
      },
      max: {
        width: 590,
        height: 378
      }
    }
  },
  {
    device: 'desktop',
    dimensions: {
      min: {
        width: 355,
        height: 974
      },
      max: {
        width: 545,
        height: 974
      }
    }
  }
];

// simple display component
const ProductOverview = ({ content }: IProps) => {

  const { image, heading, items } = content;

  return (
    <section className={styles.root}>
      <div className="inner">
        <div className={styles.grid}>
          <Image image={image}
            queries={queries}
            sizes="(min-width: 1300px) 33vw, (min-width: 1000px) 46vw, (min-width: 750px) 42vw, 48vw"
            classes={styles.image} />
          <h2>{ heading }</h2>
          {items.map(({ icon, heading, text }, i) => {

            const { src, alt } = icon;

            return (
              <article key={`${text}-${i}`}
                className={styles.item}>
                <img src={src}
                  alt={`${alt} icon`}
                  className={styles.icon} />
                <h3 className="h4">{ heading }</h3>
                <p>{ text }</p>
              </article>
            );

          })}
        </div>
      </div>
    </section>
  );

};

export default ProductOverview;
