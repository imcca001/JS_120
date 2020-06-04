function joinOr(choices) {
    if (choices.length === 1) {
      return String(choices[0]);
    } else if (choices.length === 2) {
      return `${choices[0]} or ${choices[1]}`;
    } else {
      return `${choices.slice(0, choices.length -1)} or `
              + `${choices[choices.length - 1]}`;
    }
  };

let arr = [1,2,3,4,5];
let abb = [1, 2];
let acc = [5];

console.log(joinOr(arr));
console.log(joinOr(abb));
console.log(joinOr(acc));