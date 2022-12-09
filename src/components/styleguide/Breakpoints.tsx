import styles from './Breakpoints.module.scss';

const breakpoints = [
  {
    name: 'Min',
    width: '320px'
  },
  {
    name: 'Portrait',
    width: '750px'
  },
  {
    name: 'Landscape',
    width: '1000px'
  },
  {
    name: 'Desktop',
    width: '1300px'
  },
  {
    name: 'Max',
    width: '1680px'
  }
];

// used to show the breakpoint config which aligns to the dev's browser. Includes Sass variable names 
const Breakpoints = () => (
  <section className={`${styles.root} section`}>
    <div className="inner">
      <h2>Breakpoints</h2>
      <ul className={styles.grid}>
        {breakpoints.map(({ name, width }) => (
          <li key={name} 
            style={{ ['--width' as string]: width }}>
            <h3 className="h4">{ name }</h3>
            <h4>{ width }</h4>
            <pre>
              ${ name?.toLowerCase() }
            </pre>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Breakpoints;
