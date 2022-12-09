import styles from './Colours.module.scss';

const colours = [
  {
    name: 'blue',
    hex: '#2f63af'
  },
  {
    name: 'blue-light',
    hex: '#00bfe9'
  },
  {
    name: 'blue-pale',
    hex: 'rgba(0, 191, 233, 0.06)'
  },
  {
    name: 'green',
    hex: '#17e69a'
  },
  {
    name: 'orange',
    hex: '#eb743b'
  },
  {
    name: 'yellow',
    hex: '#ffdd33'
  },
  {
    name: 'ochre',
    hex: '#b04e41'
  },
  {
    name: 'black',
    hex: '#21252c'
  },
  {
    name: 'grey-dark',
    hex: '#757d8a'
  },
  {
    name: 'grey',
    hex: '#c9cbcf'
  },
  {
    name: 'grey-light',
    hex: '#f2f2f3'
  },
  {
    name: 'white',
    hex: '#ffffff'
  }
];

// used to show the colour palette. Includes CSS variable names  
const Colours = () => (
  <section id="colours" 
    className={`${styles.root} section`}>
    <div className="inner">
      <h2>Colours</h2>
      <ul>
        {colours.map(({ name, hex }) => {

          const light = name === 'grey-light' || name === 'white' || name === 'blue-pale';

          return (
            <li key={name} 
              className={`${styles.swatch}${light ? ' ' + styles.light : ''}`}
              style={{ ['--hex' as string]: hex }}>
              <h4>{ hex }</h4>
              <pre>
                var(--{ name })
              </pre>
            </li>
          );
          
        })}
      </ul>
    </div>
  </section>
);

export default Colours;
