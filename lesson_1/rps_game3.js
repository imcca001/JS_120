const readline = require('readline-sync');

const ROUNDS = 5;

const CHOICES = ["rock", "paper", "scissors", "lizard", "spock"];


const WIN_CONDITIONS = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  spock: ["scissors", "rock"],
};


function createPlayer() {
  return {
    move: null,
    score: 0,
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log("");
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

// eslint-disable-next-line max-lines-per-function
function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    weight: {},

    choose(historyObj) {
      this.calculateWeights(historyObj);

      if (Object.values(this.weight).filter(val => val === 0).length > 1) {
        let choices = [];

        for (let prop in this.weight) {
          if (this.weight[prop] === 0) {
            choices.push(prop);
          }
        }

        let randomIndex = Math.floor(Math.random() * choices.length);
        this.move = choices[randomIndex];
      } else {
        let key = Object.keys(this.weight).reduce((a, b) => {
          return this.weight[a] < this.weight[b] ? a : b;
        });

        this.move = key
      }
    },

    calculateWeights(historyObj) {

      let totalHumanWins = historyObj.outcomes.filter(val => val === 'human').length;

      CHOICES.forEach(choice => {

        let moveWins = historyObj.outcomes.filter((val, idx) => {
          return (val === "human") && (historyObj.computerHistory[idx] === choice);
        }).length;

        let movePercent = (moveWins / totalHumanWins) || 0;

        this.weight[choice] = movePercent;
      });
    },
  };

  return Object.assign(playerObject, computerObject);
}

function scoreKeeper() {
  return {
    scoreboard: { human: 0, computer: 0 },

    updateScore(winner) {
      if (winner !== "tie") {
        this.scoreboard[winner] += 1;
      }
    },

    displayScore() {
      console.log(`Current game score => You: ${this.scoreboard.human}, Computer: ${this.scoreboard.computer}`);
    },
  };
}

function createHistory() {
  return {
    humanHistory: [],
    computerHistory: [],
    outcomes: [],

    updateHistory(human, computer, winner) {
      this.humanHistory.push(human);
      this.computerHistory.push(computer);
      this.outcomes.push(winner);
    },

    displayHistory() {
      console.log();
      console.log("ROUND HISTORY:");
      this.humanHistory.forEach((move, idx) => {
        console.log(`Round ${idx + 1} => You chose: ${move}, computer chose: ${this.computerHistory[idx]}, winner: ${this.outcomes[idx]}`);
      });
      console.log();
    }
  };
}

// eslint-disable-next-line max-lines-per-function
function makeMove(human, computer) {
  return {
    humanMove: human.move,
    computerMove: computer.move,
    roundWinner: null,

    determineRoundWinner() {
      if (WIN_CONDITIONS[this.humanMove].includes(this.computerMove)) {
        this.roundWinner = "human";
      } else if (this.humanMove === this.computerMove) {
        this.roundWinner = "tie";
      } else {
        this.roundWinner = "computer";
      }
    },

    displayRoundWinner() {
      console.log();
      console.log(`You chose: ${this.humanMove}`);
      console.log(`The computer chose: ${this.computerMove}`);
      console.log();

      switch (this.roundWinner) {
        case "human":
          console.log("You win this round!");
          break;
        case "computer":
          console.log("Computer wins this round!");
          break;
        default:
          console.log("It's a tie!");
      }
    },
  };
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  oneRound: null,
  score: null,
  gameWinner: null,
  history: null,



  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Rock, Paper, Scissors, Lizard, Spock!");
    console.log("Win 5 rounds to win the game.");
    console.log();
  },

  displayRules() {
    console.log("Here are the Game Rules:");
    console.log("=> Rock crushes Scissors & Lizard");
    console.log("=> Paper covers Rock & disproves Spock");
    console.log("=> Scissors cuts Paper & decapitaes Lizard");
    console.log("=> Lizard poisons Spock & eats Paper");
    console.log("=> Spock smashes Scissors & vaporizes Rock");
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors, Spock, Lizard. Goodbye!');
  },

  completedRounds() {
    return Object.values(this.score.scoreboard).some(val => val >= ROUNDS);
  },

    determineGameWinner() {
    if (this.score.scoreboard.human === ROUNDS) {
      this.gameWinner = "human";
    } else {
      this.gameWinner = "computer";
    }
  },

    displayGameWinner() {
    if (this.gameWinner === "human") {
      console.log("Congrats! You're the game winner!");
    } else {
      console.log("Computer is the game winner!");
    }
  },

  nextRoundMessage() {
    console.log("Please hit enter to continue to next round.");
    readline.question();
    console.clear();
  },

  playOneGame() {
    while (true) {
      this.human.choose();
      console.clear();
      this.computer.choose(this.history);

      this.oneRound = makeMove(this.human, this.computer);
      this.oneRound.determineRoundWinner();
      let winner = this.oneRound.roundWinner;
      this.oneRound.displayRoundWinner();

      this.history.updateHistory(this.human.move, this.computer.move, winner);
      this.history.displayHistory();

      this.score.updateScore(winner);
      this.score.displayScore();
      if (this.completedRounds()) break;
      this.nextRoundMessage();
    }
  },

    playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  play() {
    this.displayWelcomeMessage();
    this.displayRules();
    while (true) {
      console.clear();
      this.history = createHistory();
      this.score = scoreKeeper();
      this.playOneGame();
      this.determineGameWinner();
      this.displayGameWinner();
      if (!this.playAgain()) break;
    }
    this.displayGoodbyeMessage();
  },
};


RPSGame.play();