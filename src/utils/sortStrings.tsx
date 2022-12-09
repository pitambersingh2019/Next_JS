// sort an array of strings alphabetically
const sortStrings = (items: string[]): string[] => items.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);

export default sortStrings;
