const readline = require('readline-sync');
const WINNING_CHOICES = {
  rock: ['scissors'],
  paper: ['rock'],
  scissors: ['paper'],
  // rock: ['scissors', 'lizard'],
  // paper: ['rock', 'spock'],
  // scissors: ['paper', 'lizard'],
  // lizard: ['paper', 'spock'],
  // spock: ['rock', 'scissors'],
};

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
    maxScore: 0,
    roundWinner: null,

    determineRoundWinner(humanMove, computerMove) {
      if (humanMove === computerMove) {
        this.roundWinner = 'tie';
      } else if (WINNING_CHOICES[humanMove].includes(computerMove)) {
        this.roundWinner = 'human';
      } else {
        this.roundWinner = 'computer';
      }
    },

    updateScores(player) {
      if (this.roundWinner === 'human') {
        this.humanScore += 1;
      } else if (this.roundWinner === 'computer') {
        this.computerScore += 1;
      }
    },

    resetScore() {
      this.humanScore = 0;
      this.computerScore = 0;
    },

    resetRoundWinner() {
      this.roundWinner = null;
    },

    determineGameWinner() {
      return this.humanScore > this.computerScore ? 'you' : 'Computer';
    },

    isGameOver() {
      return (this.humanScore === this.maxScore || 
        this.computerScore === this.maxScore);
    },

    setMaxScore() {
      while (true) {
        this.maxScore = parseInt(readline.question('=> Enter the max score for the game: '), 10);
        if (Number.isInteger(this.maxScore) && this.maxScore > 0) {
          console.clear();
          break;
        }
        console.log('=> Sorry, invalid choice.');
      }
    },

  };

  return scoreboard;
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  message(text) {
    console.log(`=> ${text}`);
  },

  displayWelcomeMessage() {
    console.log('Welcome to Rock Papaer Scissiors');
  },

  displayGoodbyeMessage() {
    console.log('Thank you for playing Rock, Paper, Scissors, Goodbye');
  },

  displayRules() {
    console.log();
    this.message('Here are the rules!');
    this.message('Rock beats scissors and lizard.');
    this.message('Paper beats rock and spock.');
    this.message('Scissors beats paper and lizard.');
    this.message('Lizard beats paper and spock.');
    this.message('Spock beats rock and paper.');
    console.log();
  },

   displayRoundWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    let winner = this.gameScore.roundWinner;

    console.clear();
    this.message(`You chose: ${humanMove}`);
    this.message(`The computer chose: ${computerMove}`);

    if (winner === 'human') {
      this.message('You won the round!');
    } else if (winner === 'computer') {
      this.message('Computer won the round!');
    } else {
      this.message("It's a tie!");
    }

    console.log();
  },

  // displayWinner() {
  //   let humanMove = this.human.move;
  //   let computerMove = this.computer.move;

  //   console.log(`You choose ${this.human.move}.`);
  //   console.log(`The Computer choose ${this.computer.move}.`);

  //   if ((humanMove === 'rock' && computerMove === 'scissors') ||
  //       (humanMove === 'paper' && computerMove === 'rock') ||
  //       (humanMove === 'scissors' && computerMove === 'paper')) {
  //     console.log('You are the winner!');
  //     this.scoreboard.updateScore('human');
  //   } else if ((computerMove === 'rock' && humanMove === 'scissors') ||
  //            (computerMove === 'paper' && humanMove === 'rock') ||
  //            (computerMove === 'scissors' && humanMove === 'paper')) {
  //     console.log('Computer is the winner!');
  //     this.scoreboard.updateScore('computer');
  //   } else {
  //     console.log('It\'s a tie!');
  //   }
  // },

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

  displayScore() {
    console.log('\n');
    console.log(`Computer score is ${this.gameScore.computerScore}.`);
    console.log(`Human score is ${this.gameScore.humanScore}.`);
    console.log('\n');
  },

    displayGameOver() {
    console.log('*'.repeat(40));
    this.message(`${this.gameScore.determineGameWinner()} won the game!`);
    this.message('The final scores are:');
    this.message(`Human Player: ${this.gameScore.humanScore} out of ${this.gameScore.maxScore}`);
    this.message(`Computer Score: ${this.gameScore.computerScore} out of ${this.gameScore.maxScore}`);
  },

  playRound() {
    this.human.choose();
    this.computer.choose();
    this.gameScore.determineRoundWinner(this.human.move, this.computer.move);
    this.displayRoundWinner();
    this.gameScore.updateScores();
    this.gameScore.resetRoundWinner();
    this.displayScore();
  },

  play() {
    this.displayWelcomeMessage();
    this.displayRules();

    while (true) {
      this.gameScore = createScoreboard();
      this.gameScore.setMaxScore();
      while (!this.gameScore.isGameOver()) {
        this.playRound();
      }

      this.displayGameOver();
      if (!this.playAgain()) {
        break;
      } else {
        console.clear();
      }
    }
    this.displayGoodbyeMessage();

  },
};

RPSGame.play();