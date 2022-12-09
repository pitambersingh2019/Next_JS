import styles from './Grid.module.scss';

// used to show the grid config, which collapses based on the breakpoints
const Grid = () => (
  <section>
    <div className="section inner inner--padded col">
      <h2 className="divider divider--left">Grid</h2>
      <ul className={`grid ${styles.grid}`}>
        {Array(6).fill('').map((_, i) => <li key={i}>Col</li>)}
      </ul>
    </div>
  </section>
);

export default Grid;
