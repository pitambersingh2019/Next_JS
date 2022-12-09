// turns an original array into an array of arrays (of a given chunk size). Useful for paginating data, e.g. if the original array size was 7 & the chunk size was 5, this method would return [[1, 2, 3, 4, 5], [6, 7]] 
const chunk = (array: any, size: number): [] => 

  array.reduce((acc: any, _: any, i: number) => {

    if (i % size === 0) acc.push(array.slice(i, i + size));
    
    return acc;
  
  }, []);

export default chunk;
