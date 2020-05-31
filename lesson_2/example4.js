// let Animal = {};
// let Cat = Object.create(Animal);
// let fluffy = Object.create(Cat);
// console.log(fluffy instanceof Animal);

// class Animal {}
// class Cat extends Animal {}
// let fluffy = new Cat();
// console.log(fluffy instanceof Object);
// console.log(Object.getPrototypeOf(fluffy));

// function Animal() {}
// function Cat() {}
// Cat.prototype = new Animal();
// function makeCat() {
//   return {};
// }

// let fluffy = makeCat();
// console.log(fluffy instanceof Animal);

let Animal = {};
let Cat = Object.create(Animal);
let fluffy = Object.create(Cat);
console.log(fluffy instanceof Animal);