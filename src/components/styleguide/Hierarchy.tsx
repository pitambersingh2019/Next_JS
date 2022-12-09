import { Button } from '_atoms';
import styles from './Hierarchy.module.scss';

// used to show the typography hierarchy. Includes font sizes for the different elements & classes
const Hierarchy = () => (
  <section className={`${styles.root} section`}>
    <div className="inner">
      <h2>Hierarchy</h2>
      <article className={styles.content}>
        <div className={styles.item}>
          <h1>Heading 1</h1>
          <h4>3.6 - 4rem</h4>
          <pre>&lt;h1&gt;, .h1</pre>
        </div>
        <div className={styles.item}>
          <h2>Heading 2</h2>
          <h4>2.8 - 3.2rem</h4>
          <pre>&lt;h2&gt;, .h2</pre>
        </div>
        <div className={styles.item}>
          <h3>Heading 3</h3>
          <h4>2.1 - 2.4rem</h4>
          <pre>&lt;h3&gt;, .h3</pre>
        </div>
        <div className={styles.item}>
          <h4>Heading 4</h4>
          <h4>1.6 - 1.8rem</h4>
          <pre>&lt;h4&gt;, .h4</pre>
        </div>
        <div className={styles.item}>
          <h5>Heading 5</h5>
          <h4>1.1 - 1.2rem</h4>
          <pre>&lt;h5&gt;, .h5</pre>
        </div>
        <div className={styles.item}>
          <p className="text--large">Large text paragraph. Blog actually jianbing, pop-up hoodie vape trust fund DIY austin truffaut ennui skateboard kombucha. Intelligentsia aesthetic portland unicorn quinoa, pickled everyday carry</p>
          <h4>1.8 - 2rem</h4>
          <pre>.text--large</pre>
        </div>
        <div className={styles.item}>
          <a href="#" 
            className="text-link text--large">
            Large text link
          </a>
        </div>
        <div className={styles.item}>
          <p>Paragraph. Blog actually jianbing, pop-up hoodie vape trust fund DIY austin truffaut ennui skateboard kombucha. Intelligentsia aesthetic portland unicorn quinoa, pickled everyday carry. Succulents helvetica green juice banjo you probably haven't heard of them forage banjo cronut banh mi shaman air plant bitters migas iPhone</p>
          <h4>1.4 - 1.6rem</h4>
          <pre>&lt;p&gt;</pre>
        </div>
        <div className={styles.item}>
          <p className="text--medium">Medium text paragraph. Blog actually jianbing, pop-up hoodie vape trust fund DIY austin truffaut ennui skateboard kombucha. Intelligentsia aesthetic portland unicorn quinoa, pickled everyday carry. Fashion axe glossier distillery shabby chic skateboard pitchfork flexitarian helvetica etsy gochujang pug next level 8-bit</p>
          <h4>1.2 - 1.4rem</h4>
          <pre>.text--medium</pre>
        </div>
        <div className={styles.item}>
          <a href="#" 
            className="text-link text--medium">
            Medium text link
          </a>
        </div>
        <div className={styles.item}>
          <small>Small print, terms and conditions and other such morsels deemed less important to the user</small>
          <h4>1.1 - 1.2rem</h4>
          <pre>.text--small, &lt;small&gt;, .small</pre>
        </div>
        <div className={styles.item}>
          <a href="#" 
            className="text-link text--small">
            Small text link
          </a>
        </div>
        <div className={`${styles.item} ${styles.buttons} employee`}>
          <Button text="Primary"
            prominence="primary" />
          <Button text="Alt primary"
            prominence="alt" />
          <Button text="Secondary" />
        </div>
        <div className={`${styles.item} ${styles.buttons} ${styles.admin}`}>
          <Button text="Primary (admin)"
            prominence="primary" />
          <Button text="Secondary (admin)" />
        </div>
      </article>
    </div>
  </section>
);

export default Hierarchy;
