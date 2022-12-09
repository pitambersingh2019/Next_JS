import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Restricted } from '_atoms';
import Hidden from './Hidden';
import { Chevron } from '_vectors';
import { useExpanded, useVector } from '_hooks';
import { delay, hasSubRoute } from '_utils';
import styles from './Admin.module.scss';

interface INavItem extends ILink {
  icon: IconType;
}

interface IActive {
  item: INavItem;
}

interface IItems {
  items: INavItem[];
  indicate?: INavItem;
  scroll?: boolean;
}

interface IIcon {
  vector: string;
}

const adminRoot = '/admin';

// define nav item data 
const navItems: INavItem[] = [
  {
    text: 'Dashboard',
    target: '/admin',
    icon: 'dashboard'
  },
  {
    text: 'Learning',
    target: '/admin/learning',
    icon: 'learning'
  },
  {
    text: 'Happiness',
    target: '/admin/happiness',
    icon: 'happiness'
  },
  {
    text: 'Surveys',
    target: '/admin/surveys',
    icon: 'survey'
  },
  {
    text: 'Praise',
    target: '/admin/praise',
    icon: 'praise'
  },
  {
    text: 'Team',
    target: '/admin/team',
    icon: 'team'
  },
  {
    text: 'Rewards',
    target: '/admin/rewards',
    icon: 'discount'
  },
  {
    text: 'Knowledge hub',
    target: '/admin/knowledge-hub',
    icon: 'whitepaper'
  }
];

// used to render an active nav item contianing icon & text, extracted here to make use of useVector hook 
const Active = ({ item }: IActive) => {

  const { text, icon } = item;
  const Vector = useVector(icon);

  return (
    <>
      <span className="icon-wrapper">{Vector && <Vector />}</span>
      { text }
    </>
  );

};

// used to render an icon, extracted here to make use of useVector hook 
const Icon = ({ vector }: IIcon) => {

  const Vector = useVector(vector);

  return Vector && <Vector />;

};

// used to render the nav items, extracted here to reduce reptition in parent component 
const Items = ({ items, indicate, scroll = false }: IItems) => {

  const activeRef = useRef<HTMLLIElement>(null);
  const router = useRouter();

  useEffect(() => {

    // ensure that an overflowed nav item (on medium screen sizes) is always in view on page load
    if (indicate && scroll && !router.asPath.includes('#')) delay(100).then(() => activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'end', behavior: 'smooth' }));

  }, [indicate, scroll, activeRef]);

  return (
    <ul>
      {items.map(({ text, target, icon }, i) => {

        let active = false;

        if (indicate && target === adminRoot && indicate.target === target) active = true;

        if (indicate && target !== adminRoot && indicate.target.startsWith(target)) active = true;

        return (
          <li key={`${text}-${i}`}
            ref={active ? activeRef : null}>
            <Link href={target}>
              <a className={`${styles.link}${active ? ' ' + styles.active : ''} text--medium`}>
                <span className="icon-wrapper"><Icon vector={icon} /></span>
                { text }
              </a>
            </Link>
          </li>
        );

      })}
    </ul>
  );

};

// used to render the admin dashboard nav
const Admin = () => {

  const router = useRouter();
  const { asPath, query } = router;
  const { expanded, toggleExpanded, handleClick } = useExpanded();
  const [current, setCurrent] = useState<INavItem>(navItems[0]);

  useEffect(() => {

    // work out which nav item to highlight as active, regardless of depth of URL structure
    const sliced = asPath.slice(0, -1);
    const item = hasSubRoute(sliced)
      ? [...navItems].slice(1).find(item => sliced.startsWith(item.target))
      : navItems[0];

    if (item) setCurrent(item);

  }, [asPath]);

  return (
    <Restricted allow={['Admin']}>
      <header className={`${styles.root}${expanded ? ' ' + styles.expanded : ''}`}
        onClick={handleClick}>
        <Hidden classes={styles.hidden}
          expanded={expanded}>
          <Items items={navItems.filter(item => item.target !== current.target)} />
        </Hidden>
        <nav className={styles.visible}>
          <Items items={navItems}
            indicate={current}
            scroll={!query.scroll} />
        </nav>
        <span className={styles.current}>
          <button className={`${styles.link} text--medium`}
            onClick={toggleExpanded}>
            <Active item={current} />
          </button>
          <Chevron />
        </span>
      </header>
    </Restricted>
  );

};

export default Admin;
