create a folder restnodeapi
create app.js
to create package.json 
npm init on terminal
add "start": "node app.js" in package.json
npm install --save express
npm install --save-dev nodemon
replace "start": "nodemon app.js"
npm install --save body-parser //to parse incoming request like req.body.title when you install the body-parser you will be able to get this content

go to postman
select POST request
select Body
select raw /JSON
http://localhost:8080/feed/post
