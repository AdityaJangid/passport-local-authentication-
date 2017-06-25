nodejs API that can save the username password and email of a user and save them in mongodb.
Also verfies the username and password of the user at the time of login

use the url for creating a new user

`http://localhost:3001/signUp`

use postman chrome extension for sending the username and password in body
`{
"username": "Aditya"
"password": "password"
"email": "xyz@gmail.com"
}`

use the url for  vefifying a already registered user

`http://localhost:3001/login`

use postman chrome extension for sending the username and password in body
`
{
"username": "Aditya"
"password": "password"
}`
