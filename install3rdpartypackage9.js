evertime we run our app i need to quit the app using ctrl+c and restart it if any change occurs
this can happen with installing a 3rd party package
how to install it we need to know the package name 
for autostart you can use a package nodemon 
npm install nodemon --save (this would install as production dependency)
npm install nodemon --save-dev (this will add as development)
npm install nodemon -g (install globally in your machine and can be used anywhere)

we will use npm install nodemon --save-dev
it gives you new folder node_modules
package-lock.json
and package.json and it adds devDependencies
npm install will update the nodemon version
you can delete that folder and run npm install to get it back
