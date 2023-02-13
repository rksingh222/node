npm = node package manager
npm is used to install third party packages
npm is also used to initialize a node project or to add some extra features to it
lets suppose you got two files app.js and routes.js
in command prompt
hit npm init
you will be prompted with couple of questions
name of your package : if you just hit enter it will take the project name
description : give description
entry point: app.js
author : rahul singh
once you hit all of them 
you get package.json
you can add your own scripts
"scripts": {
  ,
   "start": "node app.js"
}
then npm start
this will execute node app.js
if you share this project you don't have to guess which is the entry point

"scripts": {
  "start-server": "node app.js"
}
now if you do npm start-server doesn't work
so to work you have to use
npm run start-server
