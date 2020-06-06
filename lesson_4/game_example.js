
let readline = require("readline-sync");

const helperFunc = {
  joinOr(array, normalSeperator = ", ", lastSeperator = "or") {
    if (array.length === 1) return array[0];
    if (array.length === 2) return array.join(" " + lastSeperator + " ");
    if (array.length >= 3) {
      return (
        array.slice(0, array.length - 1).join(normalSeperator) +
        normalSeperator +
        lastSeperator +
        " " +
        array[array.length - 1]
      );
    }
    return null;
  },
};

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  toString() {
    return this.marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let idx = 1; idx <= 9; idx++) {
      this.squares[String(idx)] = new Square(" ");
    }
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter((key) => {
      return this.squares[key].getMarker() === player.marker;
    });

    return markers.length;
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter((key) => this.squares[key].isUnused());
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  // eslint-disable-next-line max-lines-per-function
  display() {
    console.log("");
    console.log("     |     |");
    console.log(
      `  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`
    );
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(
      `  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`
    );
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(
      `  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`
    );
    console.log("     |     |");
    console.log("");
  }

  resetMarkers() {
    Object.keys(this.squares).forEach((key) =>
      this.markSquareAt(key, Square.UNUSED_SQUARE)
    );
  }
}

class Player {
  constructor(marker, score = 0) {
    this.marker = marker;
    this.score = score;
  }

  getMarker() {
    return this.marker;
  }

  increaseScore() {
    this.score++;
  }
}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Player(Square.HUMAN_MARKER);
    this.computer = new Player(Square.COMPUTER_MARKER);
    this.turn = this.human;
    this.gameStartedWith = this.human;
  }

  static MATCH_GOAL = 3;

  static POSSIBLE_WINNING_ROWS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],
    ["1", "5", "9"],
    ["3", "5", "7"],
  ];

  getTurn() {
    return this.turn;
  }

  setTurn(player) {
    this.turn = player;
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some((row) => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  handleScore() {
    if (this.isWinner(this.human)) {
      this.human.increaseScore();
    }
    if (this.isWinner(this.computer)) {
      this.computer.increaseScore();
    }
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  handleRoundResults() {
    this.displayResults();
    this.handleScore();
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  play() {
    console.clear();
    this.displayWelcomeMessage();

    do {
      this.playRound();
      if (this.reachedPoints()) break;
    } while (this.playAgain());

    console.log(
      `Human: ${this.human.score} | Computer: ${this.computer.score}`
    );
    this.displayEnding();
  }

  reachedPoints() {
    return (
      this.human.score === TTTGame.MATCH_GOAL ||
      this.computer.score === TTTGame.MATCH_GOAL
    );
  }

  displayEnding() {
    this.displayGoodbyeMessage();
  }

  playRound() {
    console.log(
      `Human: ${this.human.score} | Computer: ${this.computer.score}`
    );
    this.board.display();

    while (true) {
      this.moves();
      if (this.gameOver()) break;
      console.clear();
      this.board.display();
      this.moves();
      if (this.gameOver()) break;

      this.clearup();
      this.board.display();
    }
    this.clearup();
    this.board.display();
    this.handleRoundResults();
    this.toggleStart();
  }

  clearup() {
    console.clear();
    console.log("");
  }

  toggleStart() {
    if (this.gameStartedWith === this.human) {
      this.setTurn(this.computer);
      this.gameStartedWith = this.computer;
    } else {
      this.setTurn(this.human);
      this.gameStartedWith = this.computer;
    }
  }

  moves() {
    if (this.getTurn() === this.human) {
      this.humanMoves();
      this.setTurn(this.computer);
    } else {
      this.computerMoves();
      this.setTurn(this.human);
    }
  }

  playAgain() {
    do {
      const againChoice = readline.question("play again? (y)es or (n)o:");
      if (againChoice.toLowerCase() === "n") return false;
      if (againChoice.toLowerCase() === "y") {
        console.clear();
        console.log("");
        this.board.resetMarkers();
        return true;
      }
      console.log("Sorry, invalid answer. Answer with eith 'y' or 'n' please.");
    } while (true);
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${helperFunc.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      let immediateThreat = this.isImmediateThreat();
      let offensiveOpportunity = this.isOffensiveOpportunity();
      if (offensiveOpportunity) {
        choice = offensiveOpportunity;
      } else if (immediateThreat) {
        choice = immediateThreat;
      } else if (this.board.squares["5"].marker === Square.UNUSED_SQUARE) {
        choice = "5";
      } else {
        choice = Math.floor(9 * Math.random() + 1).toString();
      }
    } while (!validChoices.includes(choice));

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  winnableRows(offensive, defensive) {
    return TTTGame.POSSIBLE_WINNING_ROWS.filter((row) => {
      return (
        this.board.countMarkersFor(offensive, row) === 2 &&
        this.board.countMarkersFor(defensive, row) === 0
      );
    });
  }

  isImmediateThreat() {
    let threatRows = this.winnableRows(this.human, this.computer);

    if (threatRows.length === 0) return false;
    let squareToStop = threatRows[0].filter(
      (el) => this.board.squares[el].marker === Square.UNUSED_SQUARE
    )[0];
    return squareToStop;
  }

  isOffensiveOpportunity() {
    let winningRows = this.winnableRows(this.computer, this.human);

    if (winningRows.length === 0) return false;
    let squareToWin = winningRows[0].filter(
      (el) => this.board.squares[el].marker === Square.UNUSED_SQUARE
    )[0];
    return squareToWin;
  }

  displayWelcomeMessage() {
    console.log("Welcome to Tic Tac Toe!");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }
}

let game = new TTTGame();
game.play();