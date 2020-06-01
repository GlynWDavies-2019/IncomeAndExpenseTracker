const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//     {id: 1, text: 'Flowers', amount: -20},
//     {id: 2, text: 'Salary', amount: 300},
//     {id: 3, text: 'Book', amount: -10},
//     {id: 4, text: 'Camera', amount: 150}
// ];

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(event) {
    event.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text description and an amount!');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: Number(amount.value)
        };
        transactions.push(transaction);
        addTransactionToDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = '';
        text.amount = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
        <i class="far fa-trash-alt"></i>
        </button>
    `;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((accumulator,currentValue) => (accumulator += currentValue),0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((accumulator,item) => (accumulator + item),0).toFixed(2);
    const expenses = amounts
        .filter(item => item < 0) 
        .reduce((accumulator,item) => (accumulator + item),0).toFixed(2);
    moneyPlus.innerHTML = `$${income}`;
    moneyMinus.innerHTML = `$${expenses}`;
    balance.innerHTML = `$${total}`;
};

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateValues();
}

init();

form.addEventListener('submit',addTransaction);