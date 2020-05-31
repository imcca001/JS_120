/* eslint-disable max-lines-per-function */
const readline = require('readline-sync');
const VALID_CHOICES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
const WINNING_CHOICES = {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  lizard: ['paper', 'spock'],
  spock: ['rock', 'scissors'],
};


function createPlayer() {
  return {
    move: null,
    history: [],
    wins: { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 },
    losses: { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 },
    wonRound: false,

    getWinningMoves() {
      return Object.entries(this.wins)
        .filter(entry => entry[1] > 0)
        .map(entry => entry.join(': '))
        .join(', ');
    },

    updateWinsLosses() {
      if (this.wonRound) {
        this.wins[this.move]++;
      } else {
        this.losses[this.move]++;
      }
    },

    playerWonRound() {
      this.wonRound = true;
    },

    resetWonRound() {
      this.wonRound = false;
    },
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice, index;

      while (true) {
        choice = readline.question(`=> Please choose ${VALID_CHOICES.join(', ')} or r, p, s, l, sp: `).toLowerCase();
        index = this.findChoice(choice);
        if (index >= 0) break;
        console.log('=> Sorry, invalid choice.');
      }

      this.move = VALID_CHOICES[index];
      this.history.push(this.move);
    },

    findChoice(choice) {
      return VALID_CHOICES.findIndex(word => word.startsWith(choice));
    },
  };

  return Object.assign(playerObject, humanObject);
}


function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {

    choose() {
      let choices = this.calculateWeightOfMoves()
        .map((weight, idx) => Array(weight).fill(VALID_CHOICES[idx]))
        .flat();

      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
      this.history.push(this.move);
    },

    /*
    This method will start with a default weight percentage of 20% for each
    move. If the computer lost with a move it will take into account the
    number of losses and determine the loss percentage. The weight will be
    subtracted by the loss percentage. The subtracted weight(leftoverweight)
    will be redistributed amongst the weight percentages evenly.
    */
    calculateWeightOfMoves() {
      let weights = [20, 20, 20, 20, 20];
      let lossNum = Object.values(this.losses)
        .reduce((acc, curr) => acc + curr, 0);
      let lossPercentages = Object.values(this.losses)
        .map(num => {
          return lossNum > 0 ? num / lossNum : 0;
        });

      weights = weights
        .map((weight, idx) => weight - (weight * lossPercentages[idx]));

      let leftoverWeight = (100 - weights
        .reduce((acc, curr) => acc + curr, 0)) / weights.length;

      return weights.map(weight => Math.round(weight + leftoverWeight));
    }
  };

  return Object.assign(playerObject, computerObject);
}

function createScoreboard() {
  let scoreboard = {
    humanScore: 0,
    computerScore: 0,
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

    updateScores() {
      if (this.roundWinner === 'human') {
        this.humanScore++;
      } else if (this.roundWinner === 'computer') {
        this.computerScore++;
      }
    },

    resetRoundWinner() {
      this.roundWinner = null;
    },

    determineGameWinner() {
      return this.humanScore > this.computerScore ? 'You' : 'Computer';
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
  gameScore: null,

  message(text) {
    console.log(`=> ${text}`);
  },

  displayWelcomeMessage() {
    this.message('Welcome to Rock, Paper, Scissors, Lizard, Spock!');
  },

  displayGoodbyeMessage() {
    console.clear();
    this.message('Thanks for playing Rock, Paper, Scissors, Lizard, Spock! Goodbye!');
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

  displayScore() {
    this.message('The current scores are:');
    this.message(`Human Player: ${this.gameScore.humanScore} out of ${this.gameScore.maxScore}`);
    this.message(`Computer Score: ${this.gameScore.computerScore} out of ${this.gameScore.maxScore}`);
    console.log();
  },

  displayGameOver() {
    console.log('*'.repeat(40));
    this.message(`${this.gameScore.determineGameWinner()} won the game!`);
    this.message('The final scores are:');
    this.message(`Human Player: ${this.gameScore.humanScore} out of ${this.gameScore.maxScore}`);
    this.message(`Computer Score: ${this.gameScore.computerScore} out of ${this.gameScore.maxScore}`);
  },

  displayHistory() {
    let humanMoveWins = this.human.getWinningMoves();
    let computerMoveWins = this.computer.getWinningMoves();
    this.message(`You have made the following moves: ${this.human.history.join(', ')}`);
    this.message(humanMoveWins.length > 0 ? `You have won with: ${humanMoveWins}` : 'You have not won a round yet!');
    this.message(`The computer has made the following moves: ${this.computer.history.join(', ')}`);
    this.message(computerMoveWins.length > 0 ? `The computer has won with: ${computerMoveWins}` : 'The computer has not won a round yet!');
    console.log();
  },

  setRoundWinner() {
    if (this.gameScore.roundWinner === 'human') {
      this.human.playerWonRound();
    } else if (this.gameScore.roundWinner === 'computer') {
      this.computer.playerWonRound();
    }
  },

  resetPlayersWinRound() {
    this.human.resetWonRound();
    this.computer.resetWonRound();
  },

  updatePlayersWinLossRecords() {
    this.human.updateWinsLosses();
    this.computer.updateWinsLosses();
  },

  playRound() {
    this.human.choose();
    this.computer.choose();
    this.gameScore.determineRoundWinner(this.human.move, this.computer.move);
    this.displayRoundWinner();
    this.setRoundWinner();
    this.updatePlayersWinLossRecords();
    this.resetPlayersWinRound();
    this.gameScore.updateScores();
    this.gameScore.resetRoundWinner();
    this.displayScore();
    this.displayHistory();
  },

  playAgain() {
    console.log();
    let answer = readline.question('=> Would you like to play again? (y/n): ');
    while (!['yes', 'no', 'n', 'y'].includes(answer)) {
      console.log('Sorry, that input is not valid.');
      answer = readline.question('=> Would you like to play again? (y/n): ');
    }
    return answer.toLowerCase()[0] === 'y';
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
  }
};

RPSGame.play();