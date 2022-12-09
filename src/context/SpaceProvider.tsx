import { ReactNode, useState } from 'react';
import SpaceContext from './SpaceContext';

interface IProps {
	children: ReactNode;
}

export const defaultUser: IUser = {
  id: 123,
  name: '',
  firstName: '',
  department: '',
  avatar: null,
  initials: '',
  roles: null,
  notifications: 0,
  location: null,
  team: null,
  jobRole: null,
  seniority: null,
  gender: null,
  employeeStartDate: '',
  isActive: true
};

const defaultBranding: IBranding = {
  primaryColour: null,
  logo: null
};

const defaultSpace: ISpace = {
  id: 'default',
  name: '',
  branding: defaultBranding,
  user: defaultUser,
  locations: [''],
  teams: [''],
  roles: [''],
  seniority: [''],
  hasDiscounts: false
};

// this is where the current company's space data is stored; which contains data about the current user as well as things like company branding, departments & teams etc
const SpaceProvider = ({ children }: IProps) => {

  const [space, setSpace] = useState<ISpace>(defaultSpace);
  const hasSpaceData = space.id !== 'default';

  const saveSpace = (data: ISpace) => setSpace(data);

  return (
    <SpaceContext.Provider value={{ space, hasSpaceData, saveSpace }}>
      { children }
    </SpaceContext.Provider>
  );

};

export default SpaceProvider;
