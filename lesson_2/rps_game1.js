
class Greeting {
  greet(string) {
    console.log(string);
  }
}

class Hello extends Greeting {
  hi () {
    this.greet('Hello');
  };
}

class Goodbye extends Greeting {
  bye () {
    this.greet('Goodbye');
  };
}

let hey = new Hello();
let bye = new Goodbye();

console.log(hey.hi());
console.log(bye.bye());
