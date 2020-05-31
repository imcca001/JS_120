function createBook(title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription() {
      console.log(`${this.title} was written by ${this.author}. ` +
      `I ${this.read ? "have" : "haven't"} read it.`);
    },

    readBook() {
      this.read = true;
    },

  };
}


let book1 = createBook('Mythos', 'Steohan Fry'); 
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = createBook('Aunts aren\'t Gentlemen', 'PG Wodehouse');

book1.readBook();

book1.getDescription();
book2.getDescription();
book3.getDescription();

console.log(book1.read);



