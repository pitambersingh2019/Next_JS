import { ReactNode, useEffect } from 'react';
import { Button } from '_atoms';
import Tab from './Tab';
import { useTabs } from '_hooks';
import styles from './TabbedForm.module.scss';

interface IProps {
  success: boolean;
  thanks?: string;
  info?: string;
  button?: ILink;
  classes?: string;
  children?: ReactNode;
}

// used to render a common scenario whereby we have a tabbed form - inputs on first slide & confirmation message on second slide. Once the success prop is passed in as true, we can animate between the two
const TabbedForm = ({ success, thanks = 'Thanks', info, button, classes, children }: IProps) => {

  const { wrapperRef, tabRefs, forward, activeTab, activateTab } = useTabs(2, 'form');

  useEffect(() => {

    success
      ? activateTab('success', 1)
      : activateTab('form', 0);

  }, [success]);

  return (
    <article ref={wrapperRef} 
      className={`${styles.root}${classes ? ' ' + classes : ''}`}>
      <Tab wrapper={wrapperRef}
        tab={tabRefs.current[0]}
        hide={activeTab !== 'form'}
        forward={forward}
        first={true}>
        <div ref={tabRefs.current[0]} 
          className="tab">
          { children }
        </div>
      </Tab>
      <Tab wrapper={wrapperRef}
        tab={tabRefs.current[1]}
        hide={activeTab !== 'success'}
        forward={forward}>
        <div ref={tabRefs.current[1]} 
          className="tab">
          <aside>
            <h3>{ thanks }</h3>
            <p>{ info }</p>
            {button && (
              <Button text={button.text}
                target={button.target}
                prominence="primary" />
            )}
          </aside>
        </div>
      </Tab>
    </article>
  );

};

export default TabbedForm;
