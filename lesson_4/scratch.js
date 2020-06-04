*/
IF  
  Check each combination of winning key sequences
    if any sequence filtered for human markers has length 2:
      for each key in the sequence
        if key === un-used marker
          return that key

ELSE
  Follow normal process to get random key for computer move
/*


   isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }


computerMoves() {
    let choice;

      TTTGame.POSSIBLE_WINNING_ROWS.forEach(row => {
        if (this.board.countMarkersFor(this.computer, row) === 2) {
          row.forEach((key) {
            if (row[key] === this.Square.UNUSED_SQUARE) {
              console.log(key)
              choice = key;
            }
          }
        }
      });

    if (choice === undefined) {
      let validChoices = this.board.unusedSquares();

      do {
        choice = Math.floor((9 * Math.random()) + 1).toString();
      } while (!validChoices.includes(choice));
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

