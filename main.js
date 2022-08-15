var books = []
var searchBooks = []
const RENDER_EVENT = "render-bookshelf"
const SEARCH_EVENT = "search-bookshelf"
const SAVED_EVENT = "saved-bookshelf"
const STORAGE_KEY = 'BOOK_APPS'

function isStorageExist() {
  if (typeof(Storage)=== undefined) {
    alert('Your browser not support local storage')
    return false
  }
  return true;  
}

document.addEventListener('DOMContentLoaded', function () {
  if (isStorageExist()) {
    loadDataFromStorage()
  }
  const bookForm = document.getElementById('inputBook');
  bookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
  })

  const searchForm = document.getElementById('searchBook')
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    searchBook();
  })

})

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
  incompleteBookshelfList.innerHTML=''

  const completeBookshelfList = document.getElementById('completeBookshelfList')
  completeBookshelfList.innerHTML=''
  
  for (const book of books) {
    const bookElement = showBook(book);
    if(book.isComplete){
      completeBookshelfList.append(bookElement)
    }else{
      incompleteBookshelfList.append(bookElement)
    }
  }
})

document.addEventListener(SEARCH_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
  incompleteBookshelfList.innerHTML=''

  const completeBookshelfList = document.getElementById('completeBookshelfList')
  completeBookshelfList.innerHTML=''
  
  for (const book of searchBooks) {
    const bookElement = showBook(book);
    if(book.isComplete){
      completeBookshelfList.append(bookElement)
    }else{
      incompleteBookshelfList.append(bookElement)
    }
  }
})

function searchBook(){
  var inputTitle = document.getElementById('searchBookTitle').value;
  const listBook = findBookByTitle(inputTitle);

  if (listBook == null) {
    books = []
    if (isStorageExist()) {
      loadDataFromStorage()
    }
  } else {
    searchBooks = listBook
    document.dispatchEvent(new Event(SEARCH_EVENT))
  }
}

function addBook(){
  var title = document.getElementById('inputBookTitle').value;
  var author = document.getElementById('inputBookAuthor').value;
  var year = document.getElementById('inputBookYear').value;
  var isComplete = document.getElementById('inputBookIsComplete').checked;

  const bookObject = generateBook(generateId(),title,author,year,isComplete)
  books.push(bookObject)

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function generateBook(id,title,author,year,isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function generateId(){
  return +new Date()
}

function showBook(bookObject){
  const textTitle = document.createElement('h3')
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p')
  textAuthor.innerText = bookObject.author

  const textYear = document.createElement('p')
  textYear.innerText = bookObject.year

  const actionContainer = document.createElement('div')
  actionContainer.classList.add("action")

  if (bookObject.isComplete) {
    const unfinishButton = document.createElement('button')
    unfinishButton.classList.add('green')
    unfinishButton.innerText = 'Belum selesai di Baca'

    unfinishButton.addEventListener('click', function () {
      unfinishBook(bookObject.id)
    })
    actionContainer.append(unfinishButton)
  } else {
    const finishButton = document.createElement('button')
    finishButton.classList.add('green')
    finishButton.innerText = 'Selesai dibaca'

    finishButton.addEventListener('click', function () {
      finishBook(bookObject.id)
    })
    actionContainer.append(finishButton)
  }
  
  const trashButton = document.createElement('button')
  trashButton.innerText = 'Hapus buku'
  trashButton.classList.add('red')

  trashButton.addEventListener('click', function () {
    removeBook(bookObject.id)
  })

  actionContainer.append(trashButton)

  const articleContainer = document.createElement('article')
  articleContainer.classList.add('book_item')
  articleContainer.append(textTitle,textAuthor,textYear,actionContainer)
  articleContainer.setAttribute('id', `book-${bookObject.id}`)

  return articleContainer;
}

function unfinishBook(bookId){
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function finishBook(bookId){
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function removeBook(bookId){
  const bookTarget = findBookIndex(bookId)

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function findBook(bookId){
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookByTitle(bookTitle){
  var listBook = [];
  
  if (bookTitle == "") return null;
  for (const book of books) {
    if (book.title.includes(bookTitle)) {
      listBook.push(book)
    }
  }
  return listBook;
}

function findBookIndex(bookId){
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData(){
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function loadDataFromStorage(){
  const serializedData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(serializedData)

  if (data!== null) {
    for (const book of data) {
      books.push(book)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}