import { Button } from '_atoms';
import { Image, Parallax } from '_molecules';
import styles from './Features.module.scss';

interface IItem {
  image: IImage;
  heading: string;
  text: string;
}

interface IContent {
  heading: string;
  items: IItem[];
  button: ILink;
}

export interface IProps {
  content: IContent;
}

const queries: IQuery[][] = [
  [
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
          width: 280,
          height: 258 
        }
      }
    }
  ],
  [
    {
      device: 'mobile',
      dimensions: {
        min: {
          width: 200,
          height: 125
        },
        max: {
          width: 280,
          height: 174 
        }
      }
    },
    {
      device: 'portrait',
      dimensions: {
        min: {
          width: 280,
          height: 174 
        },
        max: {
          width: 280,
          height: 174 
        }
      }
    },
    {
      device: 'landscape',
      dimensions: {
        min: {
          width: 280,
          height: 174 
        },
        max: {
          width: 280,
          height: 174 
        }
      }
    },
    {
      device: 'desktop',
      dimensions: {
        min: {
          width: 280,
          height: 174 
        },
        max: {
          width: 280,
          height: 174 
        }
      }
    }
  ],
  [
    {
      device: 'mobile',
      dimensions: {
        min: {
          width: 200,
          height: 145
        },
        max: {
          width: 280,
          height: 202 
        }
      }
    },
    {
      device: 'portrait',
      dimensions: {
        min: {
          width: 280,
          height: 202 
        },
        max: {
          width: 280,
          height: 202 
        }
      }
    },
    {
      device: 'landscape',
      dimensions: {
        min: {
          width: 280,
          height: 202 
        },
        max: {
          width: 280,
          height: 202 
        }
      }
    },
    {
      device: 'desktop',
      dimensions: {
        min: {
          width: 280,
          height: 202 
        },
        max: {
          width: 280,
          height: 202 
        }
      }
    }
  ],
  [
    {
      device: 'mobile',
      dimensions: {
        min: {
          width: 200,
          height: 198
        },
        max: {
          width: 280,
          height: 276 
        }
      }
    },
    {
      device: 'portrait',
      dimensions: {
        min: {
          width: 280,
          height: 276 
        },
        max: {
          width: 280,
          height: 276 
        }
      }
    },
    {
      device: 'landscape',
      dimensions: {
        min: {
          width: 280,
          height: 276 
        },
        max: {
          width: 280,
          height: 276 
        }
      }
    },
    {
      device: 'desktop',
      dimensions: {
        min: {
          width: 280,
          height: 276 
        },
        max: {
          width: 280,
          height: 276 
        }
      }
    }
  ]
];

const Features = ({ content }: IProps) => {

  const { heading, items, button } = content;
  const { target, text } = button;

  return (
    <Parallax classes={`${styles.root} swirl`}>
      <div className="inner">
        <h2>{ heading }</h2>
        {items.map(({ image, heading, text }, i) => (
          <article key={`${text}-${i}`}
            className={styles.item}>
            <Image image={image}
              queries={queries[i]}
              sizes="280px"
              classes={styles.image} />
            <div className={styles.block}>
              <h3>{ heading }</h3>
              <div dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          </article>
        ))}
        <Button target={target}
          text={text}
          prominence="alt" />
      </div>
    </Parallax>
  );

};

export default Features;
