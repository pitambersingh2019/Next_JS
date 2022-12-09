import { CultureSummary, FeedbackSummary, HappinessSummary, LearningSummary, PraiseSummary, SurveysSummary } from '_molecules';
import styles from './ManagerDashboard.module.scss';

// the admin dashboard, simple display component
const ManagerDashboard = () => (
  <section className={styles.root}>
    <div className={`${styles.grid} dashboard-grid inner`}>
      <h1>Manager dashboard</h1>
      <CultureSummary classes={`${styles.card} ${styles.culture}`} />
      <LearningSummary classes={`${styles.card} ${styles.learning}`} />
      <HappinessSummary classes={`${styles.card} ${styles.happiness}`} />
      <SurveysSummary classes={`${styles.card} ${styles.surveys}`} />
      <PraiseSummary classes={`${styles.card} ${styles.praise}`} />
      <FeedbackSummary classes={styles.feedback} />
    </div>
  </section>
);

export default ManagerDashboard;
