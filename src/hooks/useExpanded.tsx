import { MouseEvent, useCallback, useState } from 'react';
import { isCurrentTarget } from '_utils';

// used to toggle an expanded (or visible) state
const useExpanded = () => {

  const [expanded, setExpanded] = useState<boolean>(false);

  // memoize this to only overwrite the state value if it changes (good for performance)
  const toggleExpanded = useCallback(() => {

    setExpanded(v => !v);

  }, []);

  // this is a way of closing the expanded element if the user clicks elsewhere in the page
  const handleClick = (e: MouseEvent<HTMLElement>): false | void => isCurrentTarget(e) && setExpanded(false);

  return {
    expanded,
    toggleExpanded,
    handleClick
  };

};

export default useExpanded;
