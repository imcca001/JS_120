const readline = require('readline-sync');

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors, Spock, Lizard!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors, Spock, Lizard. Goodbye!');
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);

    if ((humanMove === 'rock' && (computerMove === 'scissors' || computerMove === 'lizard')) ||
         (humanMove === 'paper' && (computerMove === 'rock' || computerMove === 'spock')) ||
         (humanMove === 'scissors' && (computerMove === 'paper' || computerMove === 'lizard')) ||
         (humanMove === 'spock' && (computerMove === 'scissors' || computerMove === 'rock')) ||
         (humanMove === 'lizard' && (computerMove === 'paper' || computerMove === 'spock'))) {
      // console.log('You win!');
      this.human.score += 1;
    } else if ((humanMove === 'rock' && (computerMove === 'paper' || computerMove === 'spock')) ||
               (humanMove === 'paper' && (computerMove === 'scissors' || computerMove === 'lizard')) ||
               (humanMove === 'scissors' && (computerMove === 'rock' || computerMove === 'spock')) ||
               (humanMove === 'spock' && (computerMove === 'lizard' || computerMove === 'paper')) ||
               (humanMove === 'lizard' && (computerMove === 'rock' || computerMove === 'scissors'))) {
      // console.log('Computer wins!');
      this.computer.score += 1;
    } else {
      console.log("It's a tie");
    }
    console.log(`The score is computer: ${this.computer.score}, human: ${this.human.score}`);
    if (this.human.score >= 5) {
      console.log('You are the winner!');
      this.human.score = 0;
      this.computer.score = 0;
    } else if (this.computer.score >= 5) {
      console.log('Computer is the winner');
      this.human.score = 0;
      this.computer.score = 0;
    }
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  },
};

function createPlayer() {
  return {
    move: null,
    score: 0,
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, scissors, spock or lizard:');
        choice = readline.question();
        if (['rock', 'paper', 'scissors', 'spock', 'lizard'].includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

RPSGame.play();


// function createPlayer(playerType) {
//   return {
//     playerType: playerType,
//     move: null,

//     choose() {
//       if (this.isHuman()) {
//         let choice;

//         while (true) {
//           console.log('Please choose rock, paper, or scissors:');
//           choice = readline.question();
//           if (['rock', 'paper', 'scissors'].includes(choice)) break;
//           console.log('Sorry, invalid choice.');
//         }

//         this.move = choice;
//       } else {
//         const choices = ['rock', 'paper', 'scissors'];
//         let randomIndex = Math.floor(Math.random() * choices.length);
//         this.move = choices[randomIndex];
//       }
//     },