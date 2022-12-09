import Link from 'next/link';
import { Card } from '_atoms';
import styles from './BenefitsWidget.module.scss';

interface IProps {
  classes?: string;
}

// display component 
const BenefitsWidget = ({ classes }: IProps) => (
  <Card heading="Employee rewards"
    icon="discount"
    loading={false}
    classes={`${styles.root}${classes ? ' ' + classes : ''}`}>
    <div className="card__actions">
      <Link href="/admin/rewards">
        <a className="widget-link">View rewards</a>
      </Link>
    </div>
  </Card>
);

export default BenefitsWidget;
