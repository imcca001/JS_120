// Player
//  - choose
// Move
// Rule

// ???
// - compare

let readline = require('readline-sync');

function createPlayer() {
  return {
    move: null,
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {

    choose() {
        const choices = ['rock', 'paper', 'scissors'];
        let randomIndex = Math.floor(Math.random() * choices.length);
        this.move = choices[randomIndex];
     },
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject =  {

    choose() {
      let choice;

        while (true) {
          console.log('Choose a move, Rock, Paper or Scissors');
          choice = readline.question();
          if (['rock', 'paper', 'scissors'].includes(choice)) break;
          console.log('Invalid Input');
        }
        this.move = choice;
    }
  };

  return Object.assign(playerObject, humanObject);
}

function createScoreboard() {
  return {
    computerScore: 0,
    humanScore: 0,

    updateScore(player) {
      if (player === 'human') {
        this.humanScore += 1;
      } else {
        this.computerScore += 1;
      }
    },

    resetScore() {
      this.humanScore = 0;
      this.computerScore = 0;
    },
  };
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  scoreboard: createScoreboard(),

  displayWelcomeMessage() {
    console.log('Welcome to Rock Papaer Scissiors');
  },

  displayGoodbyeMessage() {
    console.log('Thank you for playing Rock, Paper, Scissors, Goodbye');
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You choose ${this.human.move}.`);
    console.log(`The Computer choose ${this.computer.move}.`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
        (humanMove === 'paper' && computerMove === 'rock') ||
        (humanMove === 'scissors' && computerMove === 'paper')) {
      console.log('You are the winner!');
      this.scoreboard.updateScore('human');
    } else if ((computerMove === 'rock' && humanMove === 'scissors') ||
             (computerMove === 'paper' && humanMove === 'rock') ||
             (computerMove === 'scissors' && humanMove === 'paper')) {
      console.log('Computer is the winner!');
      this.scoreboard.updateScore('computer');
    } else {
      console.log('It\'s a tie!');
    }
  },

  playAgain() {
    console.log('Would you like to play again (y or n)?');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  matchWinner(scoreboard) {
    if (scoreboard.computerScore === 5) {
      console.log('The Computer is the champion!');
      scoreboard.resetScore();
      return true;
    } else if (scoreboard.humanScore === 5) {
      console.log('You are the champion!');
      scoreboard.resetScore();
      return true;
    }
    return false;
  },

  displayScore(scoreboard) {
    console.log('\n');
    console.log(`Computer score is ${this.scoreboard.computerScore}.`);
    console.log(`Human score is ${this.scoreboard.humanScore}.`);
    console.log('\n');
  },

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      this.displayScore();
      this.matchWinner(this.scoreboard);
      if (!this.playAgain()) break;
    }
    this.displayGoodbyeMessage();

  },
};

RPSGame.play();