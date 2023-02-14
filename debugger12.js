To start the debugger when we update the code
Debug=> Add configuration =>select environment => node.js
.vscode => launch.json file creaste
one setting you have to add inside configuration
"restart": true,
"runtimeExecutable":"nodemon",

now if you start debugging
it fails
to add global nodemon
sudo npm install nodemon -g
install nodemon globally
