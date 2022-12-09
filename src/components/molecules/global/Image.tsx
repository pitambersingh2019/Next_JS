import { ReactNode } from 'react';
import { globals } from '_utils';

interface IProps {
  image: IImage;
  queries: IQuery[];
  sizes?: string;
  classes?: string;
  children?: ReactNode;
}

const { defaultSrc } = globals;

const config = {
  formats: [
    'webp',
    'jpg'
  ],
  mobile: '(max-width: 749px)',
  portrait: '(min-width: 750px) and (max-width: 999px)',
  landscape: '(min-width: 1000px) and (max-width: 1299px)',
  desktop: '(min-width: 1300px)'
};

// used to create a picture element containing source elements for all necessary crops (in different screen sizes) & formats (WebP & Jpg) to be passed in a query string to Umbraco's image server 
const Image = ({ image, queries, sizes, classes, children }: IProps) => {

  const { src, alt } = image;
  const { formats } = config;

  return (
    <picture className={classes ? classes : undefined}>
      {queries.map(({ device, dimensions }) => {

        // get the minimum & maximum sizes for each breakpoint
        const { min, max } = dimensions;
        const { width: minWidth, height: minHeight } = min;
        const { width: maxWidth, height: maxHeight } = max;
        
        // as a minimum, we want single & dual density options for the smallest size 
        const crops: ICrop[] = [
          {
            width: minWidth,
            height: minHeight
          },
          {
            width: minWidth * 2,
            height: minHeight * 2
          }
        ];

        // if the image changes sizes in the breakpoint, add single & dual density options for the largest size
        if (minWidth !== maxWidth) {

          crops.push(
            {
              width: maxWidth,
              height: maxHeight
            },
            {
              width: maxWidth * 2,
              height: maxHeight * 2
            }
          );

        }

        // return a source element containing the URL string for Umbraco, this is defined in data-srcset so that Blazy can lazyload the asset 
        return (
          formats.map((format, j) => (
            <source key={`${device}-${j}`} 
              media={config[device]}
              data-srcset={crops.map(crop => `${src}${!src?.includes('?') ? '?mode=crop' : ''}&width=${crop.width}&height=${crop.height}&format=${format}&quality=${format === 'webp' ? 90 : 75} ${crop.width}w`)}
              type={`image/${format === 'jpg' ? 'jpeg' : format}`} />
          ))
        );

      })}
      <img src={defaultSrc}
        data-src={defaultSrc}
        sizes={sizes ? sizes : undefined} 
        alt={alt} 
        className="b-lazy" />
      { children && children }
    </picture>
  );

};

export default Image;
