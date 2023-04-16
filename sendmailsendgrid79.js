sendgrid.com (free start)
sendgrid email and password


Follow the process

Settings
Api key give name node _name

Create and view token



Create sender
jakemiller221985@gmail.com

In node
npm install —save nodemailer nodemailer-sendgrid-transport

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: place the api key with single codes
    }
}))

transporter.sendMail({
                to: email,
                from: 'jakemiller221985@gmail.com',
                subject: 'Signup succeeded',
                html: '<h1>You successfully signed up</h1>'
            });


