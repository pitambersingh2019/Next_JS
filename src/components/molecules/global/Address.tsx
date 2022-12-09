import styles from './Address.module.scss';

interface IProps {
  address: IAddress;
  classes?: string;
}

// used to render a semantic address element
const Address = ({ address, classes }: IProps) => {

  const { region, street, locality, postcode } = address;

  return (
    <address translate="no" 
      typeof="schema:PostalAddress"
      className={`${styles.root}${classes ? ' ' + classes : ''}`}>
      <strong property="schema:addressRegion">{ region }</strong>
      <span property="schema:streetAddress">{ street }</span>
      <span property="schema:addressLocality">{ locality }</span>
      <span property="schema:postalCode">{ postcode }</span>
    </address>
  );

};

export default Address;
