import { useContext } from 'react';
import { SpaceContext } from '_context';
import { DiscountsWidget, FeedbackWidget, PraiseWidget, PromptWidget } from '_molecules';
import styles from './EmployeeDashboard.module.scss';

// the employee dashboard, simple display component that conditionally renders the discounts based on boolean in global space data (not all companies have this)
const EmployeeDashboard = () => {

  const { space } = useContext(SpaceContext);
  const { hasDiscounts } = space;

  return (
    <section className={styles.root}>
      <div className={`${styles.grid} dashboard-grid inner`}>
        <h1 className="text--large">Your workplace tools</h1>
        <PromptWidget widgetType="learning" />
        <PromptWidget widgetType="happiness" />
        <PraiseWidget classes={styles.praise} />
        <FeedbackWidget classes={styles.feedback} />
        {hasDiscounts && <DiscountsWidget classes={styles.discounts} />}
      </div>
    </section>
  );

};

export default EmployeeDashboard;
