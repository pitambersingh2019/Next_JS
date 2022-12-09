// filters out surveys without an 'isActive' boolean from an array of users
const filterInactiveUsers = (users: IUser[]): IUser[] => users.filter(item => item.isActive);

export default filterInactiveUsers;
