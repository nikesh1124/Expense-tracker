const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

const localStorageTransactions = JSON.parse(     //localStorageTransactions will hold the parsed data from the 'transactions' key in the local storage.
  localStorage.getItem('transactions')
);

//localStorage refers to a web storage object that provides a simple key-value storage mechanism in web browsers. 
//It allows you to store data in the user's browser with no expiration time. 
//The data stored in localStorage persists even when the browser is closed and reopened.

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//Sets the transactions variable to either the value retrieved from localStorage (if it's not null) or an empty array if there's no data stored for the 'transactions' key in localStorage.

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {   //trim() is used to remove leading and trailing whitespaces from a string. Whitespaces include spaces, tabs, and newline characters. 
    alert('Please add a text and amount');       // this if statement checks for null value of the text or amount entered by user. If for a transaction any of the value is null then alert get generated.
  } 
  else {
    const transaction = {   //transaction variable is a way to represent a transaction
      id: generateID(),     //generateID() generates a unique ID for the transaction
      text: text.value,     //text is text entered by user
      amount: +amount.value //amount entered by user
    };

    transactions.push(transaction);    // adding the transaction to our transactions array

    addTransactionDOM(transaction);    // adding the transaction to the DOM or in history section

    updateValues();                    // updates the balance, income and expenses in DOM

    updateLocalStorage();              // updates the local storage of web browser

    text.value = '';                   // setting text value and amount value to NULL for further transactions
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

//this generates a unique ID for transaction

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';     //assigning the sign based on the value given by user

  const item = document.createElement('li');           //creating a list item to be added in the unordered list connect at history section

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');  //adding class minus or plus for the color of text based on the amount value


  //changing the inner HTML to the formal    (trasaction_text     sign_transaction_amount     delete button)
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${     //delete button rollback the transaction added by user
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);                               //adding teh item in hsitory section
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);  // extracting the amounts of all transactions
  //The map() method iterates over each element in the transactions array. 
  //For each transaction object, it extracts the amount property and creates a new array containing only the values of the amount property from each transaction.
  

  const total = amounts
    .reduce((acc, item) => (acc += item), 0)       // reduce method is used to calculate the sum of all items in amounts list
    .toFixed(2);                                   // round up the result to 2 decimal

  const income = amounts
    .filter(item => item > 0)                      // it fetches the amounts which are greater than zero
    .reduce((acc, item) => (acc += item), 0)       // it calculates the sum of amounts fetched by above method
    .toFixed(2);                                   // round up the result to 2 decimal

  const expense = ( amounts
  .filter(item => item < 0)                        // it fetches the amounts which are less than zero
  .reduce((acc, item) => (acc += item), 0) * -1)   // it calculates the sum of amounts fetched by above method and multiply it with -1 to generate +ve result
  .toFixed(2);                                     // round up the result to 2 decimal

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {           // this function get called when the delete button of the transaction get clicked
  transactions = transactions.filter(transaction => transaction.id !== id);  // fetched the transaction with the ID value not equal to id
  // basically fetches all the transactions other than the one user wants to delete
  updateLocalStorage();                    // now again update the local storage

  init();                                  // this function updates the history list 
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));    // adding the transactions array of our transaction as the value for transactions key in localstorage of web
}

// Init app
function init() {
  list.innerHTML = '';                      // firstly it makes the whole list NULL

  transactions.forEach(addTransactionDOM);  // now each transaction in the transaction list get added to the DOM one by one
  // This line iterates over each element in the transactions array and calls the addTransactionDOM function for each element/
  updateValues();                           // when the history list get updated, values of balance, icome and expenses also get updated
}

init();

form.addEventListener('submit', addTransaction);
