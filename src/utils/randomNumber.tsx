// generate random number between x & y
const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

export default randomNumber;
