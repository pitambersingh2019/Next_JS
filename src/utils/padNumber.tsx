// add a leading zero to numbers less than 10 (e.g. 9 becomes 09)
const padNumber = (number: number): string => ('0' + number).slice(-2);

export default padNumber;
