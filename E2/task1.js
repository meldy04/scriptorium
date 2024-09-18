function flattenArray(nestedArray) {
    let combined = [];

    nestedArray.forEach(element => {
        if(Array.isArray(element)) {
            combined = combined.concat(flattenArray(element));
        } else {
            combined.push(element)
        }
    });
   
    return combined;
}

// console.log(flattenArray([1, [2, 3], [4, [5, 6]]]));

function groupBy(arr, property) {
    return arr.reduce((acc, obj) => {
        // Get the value of property from object
        const key = obj[property];

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(obj);
        
        return acc;
    }, {});
}

/*
const people = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 21 },
  { name: "Charlie", age: 22 },
];

console.log(groupBy(people, "age"));
*/

function memoize(fn) {
    let cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
        
    };
}

/*
const slowFunction = (num) => {
    // Simulate a slow computation
    for (let i = 0; i < 1e9; i++) {}
    return num * 2;
  };
  
  const memoizedFunction = memoize(slowFunction);

  console.log(memoizedFunction(5)); // Should compute and return 10
  console.log(memoizedFunction(5)); // Should return cached result: 10
  console.log(memoizedFunction(10)); // Should compute and return 20
  */

function sumNestedValues(obj) {
    let sum = 0;
    for (let key in obj) {
        if (typeof obj[key] === 'number') {
            sum += obj[key];
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sum += sumNestedValues(obj[key]);
        }
    }
    return sum;
}

/*
const data = {
    a: 1,
    b: { c: 2, d: 3 },
    e: { f: { g: 4 } },
  };
  
  console.log(sumNestedValues(data)); // Should print 10
*/

function paginateArray(arr, pageSize, pageNumber) {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    return arr.slice(start, end);
}

/*
const items = ["a", "b", "c", "d", "e", "f"];

console.log(paginateArray(items, 2, 1)); // Should print ['a', 'b']
console.log(paginateArray(items, 2, 2)); // Should print ['c', 'd']
console.log(paginateArray(items, 2, 3)); // Should print ['e', 'f']
console.log(paginateArray(items, 2, 4)); // Should print []
*/

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, handler) {
        if(!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(handler);
    }

    emit(event, data) {
        const ev = this.events[event];

        if(ev) {
            ev.forEach(handler => {
                handler.call(null, data);
            });
        }
    }
}

/*
const emitter = new EventEmitter();

emitter.on("greet", (name) => console.log(`Hello, ${name}!`));
emitter.emit("greet", "Alice"); // Should print 'Hello, Alice!'
*/

firstNonRepeatingChar = (str) => {
    let n = str.length;
    for (let i = 0; i < n; ++i) {
        let found = true;
        for (let j = 0; j < n; ++j) {
            if (i!== j && str[i] === str[j]) {
                found = false;
                break;
            }
        }
        if (found) {
            return str[i];
        }
    }
    return null;
}

/*
console.log(firstNonRepeatingChar("swiss")); // Should print 'w'
console.log(firstNonRepeatingChar("racecar")); // Should print 'e'
console.log(firstNonRepeatingChar("aabbcc")); // Should print null
*/

module.exports = {
    flattenArray,
    groupBy,
    memoize,
    sumNestedValues,
    paginateArray,
    EventEmitter,
    firstNonRepeatingChar,
  };