import { createRef, RefObject, useRef, useState } from 'react';

// used to extract common tab code from components that use tabbed content. Indexes & direction are stored here & refs are dynamically created to be passed to the Tab component for animation 
const useTabs = (length: number, initial: string) => {

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<RefObject<HTMLDivElement>[]>(Array(length).fill('').map(() => createRef()));
  const [forward, setForward] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(initial);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // common method to handle all logic to update the currently shown tab
  const activateTab = (id: string, i: number): void => {

    setForward(activeIndex < i);
    setActiveTab(id);
    setActiveIndex(i);
  
  };

  return {
    wrapperRef,
    tabRefs,
    forward,
    activeTab,
    activateTab
  };

};

export default useTabs;
