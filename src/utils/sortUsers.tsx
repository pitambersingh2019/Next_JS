// sort an array of users by their 'name' value
const sortUsers = (users: IUser[]): IUser[] => users.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);

export default sortUsers;
