import styles from './Fonts.module.scss';

const fonts = [
  {
    name: 'Montserrat',
    weight: 'Semibold (600)',
    id: 'semibold'
  },
  {
    name: 'Montserrat',
    weight: 'Medium (500)',
    id: 'medium'
  },
  {
    name: 'Montserrat',
    weight: 'Regular (400)',
    id: 'regular'
  }
];

// used to show the different fonts. Includes Sass mixin names
const Fonts = () => (
  <section className={`${styles.root} section`}>
    <div className="inner">
      <h2>Fonts</h2>
      <article className={styles.content}>
        <ul>
          {fonts.map(({ name, weight, id }) => (
            <li key={id} 
              className={styles.font}>
              <h2 className={styles[id]}>{ name }</h2>
              <h4>{ weight }</h4>
              <pre>
                @include { id }()
              </pre>
            </li>
          ))}
        </ul>
      </article>
    </div>
  </section>
);

export default Fonts;
