import Link from 'next/link';
import { Card } from '_atoms';
import styles from './WhitepapersWidget.module.scss';

interface IProps {
  classes?: string;
}

// display component 
const WhitepapersWidget = ({ classes }: IProps) => (
  <Card heading="Knowledge hub"
    icon="whitepaper"
    loading={false}
    classes={`${styles.root}${classes ? ' ' + classes : ''}`}>
    <div className="card__actions">
      <Link href="/admin/knowledge-hub">
        <a className="widget-link">Explore the knowledge hub</a>
      </Link>
    </div>
  </Card>
);

export default WhitepapersWidget;
