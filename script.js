'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUserNames = function (accounts) {
  accounts.forEach(function (user) {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

// Calculate diplay information
const displayMovements = function (account) {
  account.movements.forEach(function (movement, index) {
    const transactionType = movement > 0 ? 'deposit' : 'withdrawal';

    const transactionDisplayRow = `
    <div class="movements__row">
      <div class="movements__type movements__type--${transactionType}">
      ${index + 1} ${transactionType}
      </div>
      <div class="movements__value"> $ ${movement}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', transactionDisplayRow);
  });
};

const updateUI = function (currentAccount) {
  // Calculate all account related information
  calcGlobalBalaance(currentAccount);
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
};

const calcGlobalBalaance = function (account) {
  const globalBalance = account.movements.reduce(
    (accumalator, movement) => accumalator + movement
  );
  account.balance = globalBalance;
  labelBalance.textContent = `${Math.round(globalBalance)} USD`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);

  const expenditures = account.movements
    .filter(movement => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);

  labelSumIn.textContent = `$${Math.round(incomes)}`;
  labelSumOut.textContent = `$${Math.round(expenditures)}`;
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    updateUI(currentAccount);

    // Change the opacity, to display the account info
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    console.log('Invalid PIN or Username');
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const beneficiaryAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    transferAmount > 0 &&
    beneficiaryAccount &&
    transferAmount <= currentAccount.balance &&
    beneficiaryAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-1 * transferAmount);
    beneficiaryAccount.movements.push(transferAmount);
    updateUI(currentAccount);
  } else {
    console.log('Transfer failed');
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  const inputUsername = inputCloseUsername.value;
  const inputPin = inputClosePin.value;

  if (
    inputUsername === currentAccount.username &&
    Number(inputPin) === currentAccount.pin
  ) {
    const accountIndex = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    accounts.splice(accountIndex, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  } else {
    console.log('Credentials are invalid');
  }
});
