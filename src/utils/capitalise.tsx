// capitalises a string (makes the first character capital case) 
const capitalise = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1);

export default capitalise;
