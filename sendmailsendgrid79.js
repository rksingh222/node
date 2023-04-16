sendgrid.com (free start)
sendgrid email and password
Username : Rahulaliasjake22@gmail.com
Password:  Rahulsingh19851985

Follow the process

Settings
Api key give name node _name

Create and view token
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


Create sender
jakemiller221985@gmail.com

In node
npm install —save nodemailer nodemailer-sendgrid-transport

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

transporter.sendMail({
                to: email,
                from: 'jakemiller221985@gmail.com',
                subject: 'Signup succeeded',
                html: '<h1>You successfully signed up</h1>'
            });


