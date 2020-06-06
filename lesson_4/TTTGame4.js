let readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  getMarker() {
    return this.marker;
  }
}

class Board {
  constructor() {
    this.reset();
    this.matchScore = {
      human: 0,
      computer: 0,
    };
  }

  reset() {
    this.squares = {};
    for (let counter = 1; counter <= 9; ++counter) {
      this.squares[String(counter)] = new Square();
    }
  }

  displayWithClear() {
    console.clear();
    console.log("");
    console.log("");
    this.display();
  }

  display() {
    console.log("");
    console.log(`     |     |`);
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isUnusedSquare(key) {
    return this.squares[key].isUnused();
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.marker;
    });

    return markers.length;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.firstPlayer = this.choosePlayer();
      this.playOneGame();
      this.displayMatchWinner();
      if (this.matchWinner()) break;
      if (!this.playAgain()) break;
      console.log("Let's play again!");
    }

    this.displayGoodbyeMessage();
  }

  playOneGame() {
    this.board.reset();
    this.board.display();
    let currentPlayer = this.firstPlayer;
    while (true) {
      this.playerMoves(currentPlayer);
      if (this.gameOver()) break;

      // this.humanMoves();
      // if (this.gameOver()) break;

      // this.computerMoves();
      // if (this.gameOver()) break;
      currentPlayer = this.togglePlayer(currentPlayer);
      this.board.displayWithClear();
    }

    this.board.displayWithClear();
    this.displayResults();
    this.updateMatchScore();
    this.displayMatchScore();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  choosePlayer() {
    let firstPlayer;

    while (true) {
      console.log("Who is going first, the computer or the human? Enter (c or h): ");
      firstPlayer = readline.question().toLowerCase();

      if (["c", "h"].includes(firstPlayer)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    if (firstPlayer === 'h') {
      return this.human;
    }

    return this.computer;
}


  displayGoodbyeMessage() {
    console.log("");
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
    console.log("");
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

  updateMatchScore() {
    if (this.isWinner(this.human)) {
      this.board.matchScore["human"] += 1;
    } else if (this.isWinner(this.computer)) {
      this.board.matchScore["computer"] += 1;
    }
  }

  displayMatchScore() {
    console.log("");
    console.log("Current Match Score Is: ");
    console.log("");
    console.log(`Computer: ${this.board.matchScore["computer"]}`);
    console.log(`Human: ${this.board.matchScore["human"]}`);
    console.log("");
  }

  displayMatchWinner() {
    if (this.board.matchScore["human"] === 3) {
      console.log("Human is the match winner!");
    } else if (this.board.matchScore["computer"] === 3) {
      console.log("Computer is the match winner!");
    }
  }

  matchWinner() {
    return this.board.matchScore["human"] === 3 || this.board.matchScore["computer"] === 3;
  }

  playAgain() {
    let answer;

    while (true) {
      answer = readline.question("Play again (y/n)? ").toLowerCase();

      if (["y", "n"].includes(answer)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    console.clear();
    return answer === 'y';
  }

  togglePlayer(player) {
    return player === this.computer ? this.human : this.computer;
  }

  playerMoves(player) {
    player === this.computer ? this.computerMoves() : this.humanMoves();
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square(${TTTGame.joinOr(validChoices)}): `;

      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  static joinOr(choices, separator = ', ', conjunction = 'or') {
    if (choices.length === 1) {
      return choices[0].toString();
    } else if (choices.length === 2) {
      return `${choices[0]} ${conjunction} ${choices[1]}`;
    } else {
      let lastChoice = choices[choices.length - 1];
      let result = choices.slice(0, -1).join(separator);
      return `${result}${separator} ${conjunction} ${lastChoice}`;
    }
  }

  computerMoves() {
    let choice = this.findCriticalSquare(this.computer);

    if (!choice) {
      choice = this.findCriticalSquare(this.human);
    }

    if (!choice) {
      choice = this.board.isUnusedSquare("5") ? "5" : null;
    }

    if (!choice) {
      let validChoices = this.board.unusedSquares();

      do {
        choice = Math.floor((9 * Math.random()) + 1).toString();
      } while (!validChoices.includes(choice));
    }
      this.board.markSquareAt(choice, this.computer.getMarker());
  }

  findCriticalSquare(player) {
    for (let index = 0; index < TTTGame.POSSIBLE_WINNING_ROWS.length; index++) {
      let row = TTTGame.POSSIBLE_WINNING_ROWS[index];
      let key = this.criticalSquare(player, row);
      if (key) return key;
    }

    return null;
  }

  criticalSquare(player, row) {
    if (this.board.countMarkersFor(player, row) === 2) {
      let index = row.findIndex(key => this.board.isUnusedSquare(key));
      if (index >= 0) return row[index];
    }

    return null;
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }
}

let game = new TTTGame();
game.play();