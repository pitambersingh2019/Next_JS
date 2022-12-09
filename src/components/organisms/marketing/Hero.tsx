import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import YouTube from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';
import { Button } from '_atoms';
import { Image, Parallax } from '_molecules';
import { Play } from '_vectors';
import styles from './Hero.module.scss';

export interface IContent {
  heading: string;
  text: string;
  image: IImage;
  primaryLink: ILink;
  secondaryLink: ILink;
  video?: string;
}

export interface IProps {
  content: IContent;
}

const Modal = dynamic(import('./../../molecules/global/Modal'));

// define image sizes at different breakpoints
const queries: IQuery[] = [
  {
    device: 'mobile',
    dimensions: {
      min: {
        width: 592,
        height: 380
      },
      max: {
        width: 592,
        height: 380
      }
    }
  },
  {
    device: 'portrait',
    dimensions: {
      min: {
        width: 779,
        height: 500
      },
      max: {
        width: 779,
        height: 500
      }
    }
  },
  {
    device: 'landscape',
    dimensions: {
      min: {
        width: 779,
        height: 500
      },
      max: {
        width: 779,
        height: 500
      }
    }
  },
  {
    device: 'desktop',
    dimensions: {
      min: {
        width: 598,
        height: 384
      },
      max: {
        width: 773,
        height: 497
      }
    }
  }
];

const Hero = ({ content }: IProps) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [player, setPlayer] = useState<YouTubePlayer>();
  const { heading, text, image, primaryLink, secondaryLink, video } = content;
  const { text: primaryText, target: primaryTarget } = primaryLink;
  const { text: secondaryText, target: secondaryTarget } = secondaryLink;

  // if there's a video modal, play the video on modal launch
  const handleClick = () => {

    setModalOpen(true);
    player && player.playVideo();

  };

  useEffect(() => {

    // pause the video on modal hide
    !modalOpen && player?.pauseVideo();

  }, [modalOpen]);

  return (
    <>
      <Parallax from="top-top" 
        to="bottom-top"
        classes={`${styles.root} swirl`}>
        <div className="inner">
          <h1 dangerouslySetInnerHTML={{ __html: heading }} />
          <div className={`${styles.text} text--large`}
            dangerouslySetInnerHTML={{ __html: text }} />
          <nav className={styles.nav}>
            <ul>
              <li>
                <Button target={primaryTarget}
                  text={primaryText}
                  prominence="alt" />
              </li>
              <li>
                <Button target={secondaryTarget}
                  text={secondaryText} />
              </li>
            </ul>
          </nav>
          <Image image={image}
            queries={queries}
            sizes="(min-width: 1300px) 50vw, (min-width: 750px) 779px, 790px"
            classes={`${styles.image}${video ? ' ' + styles.faded : ''}`} />
          {video && (
            <button className={styles.play}
              onClick={handleClick}>
              <Play />
            </button>
          )}
        </div>
      </Parallax>
      {video && (
        <Modal launch={modalOpen}
          classes={`${styles.modal} modal`}
          button={false}
          emitClose={() => setModalOpen(false)}>
          <div className={styles.frame}>
            <YouTube videoId={video.split('v=')[1].split('&')[0]} 
              onReady={(instance) => setPlayer(instance.target)} />
          </div>
        </Modal>
      )}
    </>
  );

};

export default Hero;
