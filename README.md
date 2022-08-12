# Registration And Login API

Deployed on heroku : https://nameless-citadel-14148.herokuapp.com/

## Format:

```javascript
{
 "name":"String",
 "rollno":"Number",
 "password":"String",
 "phone":"Number",
 "address":"String",
 "email":"String",
 "year":"Number",
 "branch":"String",
 "gen":"String",
}
```

## EXAMPLE:

```javascript
{
    "name":"PARKHI GARG",
    "email":"parkhigarg277@gmail.com",
    "phone":"7668043605",
    "password":"Parkhi@1357",
    "address":"Ghaziabad",
    "rollno":"2000270110065",
    "year":"2",
    "branch":"CSIT",
    "gen":"Female"
}

```

## RESPONSE

```javascript
{
    "user": "62f6a8b00eb3cfca6b9ee4e9",
    "message": "User registered succesfully",
    "phone": 7668043605,
    "rollno": 2000270110065
}
```
