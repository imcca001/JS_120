// car factory fucntion

function createCar(make, model, year) {
  return {
    make,
    model, 
    year,
    running: false,

    start() {
      this.running = true;
    },

    stop() {
      this.running = false;
    },
  };
}

// initialization expression

let car1 = createCar('toyota', 'corolla', 2016);


// Car prototype with init fucntion that return this

let carPrototype = {
  start: function() {
    this.started = true;
  },

  stop: function() {
    this.started = false;
  },

  init(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  },
};

// initialization expression
let car2 = Object.create(carPrototype).init('toyota', 'carolla', 2016)


// constructor function for a new car
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.started = false;

  this.start = fucntion() {
    this.started = true;
  };

  this.stop = fucntion() {
    this.started = false;
  };
}

// initialization expression

let car3 = new Car('toyota', 'corolla', 2016);
 