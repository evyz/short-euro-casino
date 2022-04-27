# Тестовое задание

- [Ссылка на задание](https://docs.google.com/document/d/14AzrVneWFLknnNUerZUGeCNQRoMW6gfs0HMvNK5g5ug/edit#)


## От себя
Здесь есть недочёты и баги, связанные с входными данными, но т.к. я делаю просто для демонстрации понимании логики задания и как оно работает, то я считаю, что справился с задачкой.


## Запуск: 

```
git clone https://github.com/evyz/short-euro-casino.git casino
cd casino
npm i 
npm run dev 
```


## Миграции:
Перед миграциями нужно изменить src/db/knexfile.js 

```
npx knex migrate:up --knexfile src/db/knexfile.js
npx knex migrate:down --knexfile src/db/knexfile.js
```


## Запросы на WS
Делать запросы в формате JSON 
```
## сделать ставку
  {
    "type": "bet",
    "bet": "even",
    "money": 1000
  }

## Посмотреть баланс в реальном времени
  {
    "type": "balance"
  }
```

## API - запросы:

```
POST /register + в req.body указывать никнейм
```
```
GET /lasts 
```
```
GET /my-lasts + в req.body указывать никнейм 
```