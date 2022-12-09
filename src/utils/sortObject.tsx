// sort an object, to be able to compare two objects (e.g. for checking whether reporting filters have changed)
const sortObject = (object: any) => Object.keys(object).sort().reduce((r: any, k: any) => (r[k] = object[k], r), {});

export default sortObject;
