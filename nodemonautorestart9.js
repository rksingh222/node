"scripts": {
  "test":"",
  "start":"nodemon app.js",
  "start-server":"node app.js",
}

running in the terminal
nodemon app.js = will throw an error because its globally not recognized
run npm start will run and it will restart on updating the code

you could install nodemon globally if you wanted
npm install -g nodemon ( would do the trick)
