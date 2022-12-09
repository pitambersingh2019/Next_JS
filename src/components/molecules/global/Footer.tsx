import Link from 'next/link';
import { Button } from '_atoms';
import { Address, Parallax } from '_molecules';
import { Networks } from '_navigation';
import { ProsperExIcon } from '_vectors';
import styles from './Footer.module.scss';

interface IProps {
  content: IGlobalData;
  footerBlock: boolean;
}

const sydneyAddress: IAddress = {
  region: 'Sydney',
  street: '2/23 Foster Street',
  locality: 'Surry Hills',
  postcode: 'NSW 2010'
};

const goldCoastAddress: IAddress = {
  region: 'Gold Coast',
  street: '3 Oxley Circle',
  locality: 'Paradise Point',
  postcode: 'QLD 4216'
};

// footer for marketing site
const Footer = ({ content, footerBlock }: IProps) => {

  const { social, nav, signupCta } = content;
  const { heading, content: paragraph, button } = signupCta;
  const { text, target } = button;

  return (
    <footer id={footerBlock ? 'sign-up' : undefined}>
      <Parallax from="top-bottom" 
        to="bottom-bottom"
        classes={`${styles.root} background swirl`}>
        <div className="inner">
          {footerBlock && (
            <article className={styles.extra}>
              <h2>{ heading }</h2>
              <div dangerouslySetInnerHTML={{ __html: paragraph }} />
              <Button target={target}
                text={text}
                prominence="alt" />
            </article>
          )}
          <article className={styles.footer}>
            <div className={styles.grid}>
              <Link href="/">
                <a className={styles.logo} 
                  aria-label="Prosper EX">
                  <ProsperExIcon />
                </a>
              </Link>
              <nav className={styles.links}>
                <ul>
                  {nav.footer.map(({ text, target }, i) => (
                    <li key={`${text}-${i}`}>
                      <Link href={target}>
                        <a className="h5">{ text }</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Address address={goldCoastAddress}
                classes={styles.address} />
              <Address address={sydneyAddress}
                classes={styles.address} />
              <div className={styles.phone}>
                <strong>Phone</strong>
                <a href="tel:+611300529909">1300 529 909</a>
              </div>
              <Networks networks={social.networks}
                classes={styles.networks} />
            </div>
          </article>
        </div>
      </Parallax>
    </footer>
  );

};

export default Footer;
