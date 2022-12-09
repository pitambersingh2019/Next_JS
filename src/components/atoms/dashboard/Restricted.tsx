import { useContext, useEffect, useState } from 'react';
import { SpaceContext } from '_context';

interface IProps {
  allow: string[] | null;
  children: JSX.Element;
}

const Restricted = ({ allow, children }: IProps) => {

  const { space } = useContext(SpaceContext);
  const { roles } = space.user;
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {

    if (roles?.some(role => allow?.includes(role))) setAllowed(true);

  }, [roles, allow]);

  return allowed
    ? children
    : null;

};

export default Restricted;
