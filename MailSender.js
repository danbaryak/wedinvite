var emailer = require('nodemailer')

MailSender = {

    accounts: {
        'Dan': {
            user: "danbaryak@gmail.com",
            pass: "new1home!"
        },

        'Assaf': {
            user: "assaf.is.on.fire@gmail.com",
            pass: "ahuv4ever!"
        }
    },
    /**
     * Send a mail message using my Gmail account
     *
     * @param toAddress
     */
    sendMail: function (person, sendTo) {
        var toAddress = sendTo;
//        var toAddress = 'assaf.is.on.fire@gmail.com';

        var account = this.accounts[person.sendFrom];
        if (account == undefined) {
            return;
        }

        var transport = emailer.createTransport("SMTP", {
            host: "smtp.gmail.com", // hostname
            secureConnection: true, // use SSL
            port: 465, // port for secure SMTP
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        var mailOptions = {
            from: "Dan Bar-Yaakov", // sender address
            to: toAddress, // list of receivers
            subject: "הזמנה לחתונה של אסף ודן", // Subject line
            text: "", // plaintext body
//            html: "הי "  + person.name + "<br><img src='http://www.huptalentandbooking.com/images/elephants_dove.png'>" +
//                "<br>אנחנו מתחתנים וזה<br><a href='http://mbp.local:3000/reply?id="
//                + person._id + "&num=1'>אני מגיע לבד</a><br>"
            html:  "<body style='text-align:right; direction:rtl;'><b><a href='http://54.225.118.154:8080/rsvp?id="+ person._id + "'ג<>לחצו כאן כדי לצפות בהזמנה (אפשר גם מהסמארטפון)</a></body>"

        }

// send mail with defined transport object
        transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });

    }
}

module.exports = MailSender;
