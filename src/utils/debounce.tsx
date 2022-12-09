// ensures the last call of a given function was x milliseconds ago before calling the actual function. Useful for boosting performance on things like window resize handlers (that can have thousands of calls a minute)
const debounce = (func: Function, delay: number) => {

  let timerId: any;

  return function (...args: any) {

    if (timerId) {

      clearTimeout(timerId);

    }

    timerId = setTimeout(() => {

      func(...args);

      timerId = null;

    }, delay);

  };

};

export default debounce;