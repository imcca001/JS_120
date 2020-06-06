// method to determine who won and return the winner
function winner() {
  if (this.isWinner(this.human)) {
    return this.human;
  } else if (this.isWinner(this.computer)) {
    return this.computer;
  } else {
    return null
  }
}
