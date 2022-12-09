// used to work out whether the current page is on the dashboard side (if not will be the marketing side)
const isCompany = (req: any): boolean => req.headers.host.split('.')[0] !== 'www';

export default isCompany;
