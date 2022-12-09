import { Image } from '_molecules';
import styles from './HowItWorks.module.scss';

interface IItem {
  image: IImage;
  heading: string;
  conjoiningText: string;
  text: string;
}

interface IContent {
  heading: string;
  text: string;
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
        width: 200,
        height: 185
      },
      max: {
        width: 280,
        height: 258 
      }
    }
  },
  {
    device: 'portrait',
    dimensions: {
      min: {
        width: 280,
        height: 258 
      },
      max: {
        width: 280,
        height: 258 
      }
    }
  },
  {
    device: 'landscape',
    dimensions: {
      min: {
        width: 280,
        height: 258 
      },
      max: {
        width: 280,
        height: 258 
      }
    }
  },
  {
    device: 'desktop',
    dimensions: {
      min: {
        width: 280,
        height: 258 
      },
      max: {
        width: 420,
        height: 203
      }
    }
  }
];

// simple display component 
const HowItWorks = ({ content }: IProps) => {

  const { heading, text, items } = content;

  return (
    <section className={styles.root}>
      <div className="inner">
        <div className={styles.intro}>
          <h2>{ heading }</h2>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
        <div className={styles.grid}>
          {items.map(({ image, heading, conjoiningText, text }, i) => (
            <article key={`${text}-${i}`}
              className={styles.item}>
              <header className={styles.header}>
                <Image image={image}
                  queries={queries}
                  sizes="(min-width: 1300px) 25vw, (min-width: 1000px) 44vw, (min-width: 750px) 51vw, 420px"
                  classes={styles.image} />
                <h3>{ heading }</h3>
              </header>
              <div className={styles.body}>
                <h4 className="text--body">{ conjoiningText }</h4>
                <p>{ text }</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

};

export default HowItWorks;
