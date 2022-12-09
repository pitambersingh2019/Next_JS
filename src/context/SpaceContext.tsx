import { createContext } from 'react';

const SpaceContext = createContext({
  space: {} as ISpace,
  hasSpaceData: false,
  saveSpace: (_: ISpace) => {}
});

export default SpaceContext;
