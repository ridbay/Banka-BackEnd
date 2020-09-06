# Banking App with Express Server and MongoDB
Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money.


## Live Server
https://factual-ruby-board.glitch.me/

## Features

- Express
- REST API
- MongoDB

## Requirements

- [node & npm](https://nodejs.org/en/)
- [git](https://git-scm.com/)
- [mongodb](https://www.mongodb.com/)

## Installation

- `git clone https://github.com/ridbay/Banka-BackEnd.git`
- `cd Banka-BackEnd`
- `npm install`
- `npm start`
- optional: include _.env_ in your _.gitignore_

### GET Routes

- visit https://factual-ruby-board.glitch.me/
  - USERS
  - /api/v1/auth/users (All users)
  - /api/v1/auth/user (one user)
  - ACCOUNTS
  - /api/v1/accounts (Retrieve all accounts)
  - /api/v1/accounts/:accountNumber (Retrieve a single account with accountNumber)
  - TRANSACTIONS
  - /api/v1/transactions (Get all transactions)
  - /api/v1/transactions/:id (Get One transactions)

### POST Routes
- visit https://factual-ruby-board.glitch.me/
  - USERS
  - /api/v1/auth/signup (Create a new user)
  - /api/v1/auth/signin (Signin an existing user)
  - ACCOUNTS
  - /api/v1/accounts (Create a new account)

  - TRANSACTIONS
  - /api/v1/transactions/:accountNumber/credit (Credit Account)
  - /api/v1/transactions/:accountNumber/debit (Debit Account)


### PUT Routes
- visit https://factual-ruby-board.glitch.me/

  - ACCOUNTS
  - /api/v1/accounts/:accountNumber (Update a account with accountNumber)



### DELETE Routes
- visit https://factual-ruby-board.glitch.me/
  - USERS
  - /api/v1/auth/deleteAll (Delete all Users)

  - ACCOUNTS
  - /api/v1/accounts/:id (Delete an account with accountNumber)

  - TRANSACTIONS
  - /api/v1/transactions/:id (Delete an transaction with an ID)



#### Postman (Example)

- Install [Postman](https://www.getpostman.com/apps) to interact with REST API
- Create a User with:
  - URL: https://factual-ruby-board.glitch.me/api/v1/auth/signup
  - Method: POST
  - Body: raw + JSON (application/json)
  - Body Content: `{ "firstName": "Ridwan", "lastName":"Balogun", "email":"ridwan@gmail.com", "password":"secret",}`

