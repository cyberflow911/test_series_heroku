const nodemailer = require('nodemailer');
const fs = require('fs');


const hbs = require('nodemailer-express-handlebars');




module.exports =async (mail)=>

{
            // async..await is not allowed in global scope, must use a wrapper
         
           
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth: {
                    user: 'abc@gmail.com', //email of the root mail
                    pass: 'password' //password of the root mail
                }
            });
            

            transporter.use('compile',hbs({
                viewEngine: 'express-handlebars',
                viewPath: './views'

            }))
            var mailList = [
                `${mail}`
                // 'anasingh654@gmail.com'
            ]
            var mailSidhath = 'Hello world'
        
            // send mail with defined transport object
            let info = await transporter.sendMail({
            from: "barbertest035164@gmail.com", // sender address
            to: mailList, // list of receivers
            subject: mailSidhath, // Subject line
            text: mailSidhath, // plain text body
            
            template: 'index'
            });

            
        
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
        
        
        

}