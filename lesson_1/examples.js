// function createGreeter(language) {
//   switch (language) {
//     case 'en':
//       return () => console.log('Hello!');
//     case 'es':
//       return () => console.log('Hola!');
//     case 'fr':
//       return () => console.log('Bonjour!');
//   }
// }

function createGreeter(language) {
  switch (language) {
    case 'en':
      return () => console.log('Hello!')
    case 'es':
      return function() { 
        console.log('Hola!');
      }
    case 'fr':
      return () => console.log('Bonjour!');
  }
}

let greeterEs = createGreeter('es');
greeterEs(); // logs 'Hola!'
greeterEs(); // logs 'Hola!'
greeterEs(); // logs 'Hola!'

let greeterEn = createGreeter('en');
greeterEn(); // logs 'Hello!'