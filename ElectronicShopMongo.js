const express = require("express");
const http = require("http");
const app = express();
var port = process.env.PORT || 8080;
const server = http.createServer(app);
var path = require('path');
const bodyParser = require("body-parser");
app.use(express.static(__dirname));  //specifies the root directory from which to serve static assets [images, CSS files and JavaScript files]
app.use(bodyParser.urlencoded({ extended: true })); //parsing bodies from URL. extended: true specifies that req.body object will contain values of any type instead of just strings.
app.use(bodyParser.json()); //for parsing json objects
var nodemailer = require("nodemailer");
var request = require('request');
app.set('view-engine', 'ejs');

var mongoose = require("mongoose");
const { verify } = require("crypto");
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Boris:braude123@electronicshop.c4fhf.mongodb.net/ElectronicShop?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
var db = mongoose.connection;

var bcrypt = require('bcryptjs');

const urlEncrypt = require('url-encrypt');
const e = require("express");

const encryptor = urlEncrypt({ secretKey: 'some-secret-key' });

rand = Math.floor((Math.random() * 100) + 54);

var passwordChangeEmail; //used for update password

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "electronicshoptask@gmail.com",
        pass: "iqyhbkfnslcuaiyr"
    }
});
var rand, mailOptions, host, link;
var datalogin;

app.post('/send', function (req, res) {


});


app.get('/verify', function (req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            //update data base
            db.collection("Users").updateOne({ _id: mailOptions.to }, { $set: { verifyEmail: "true" } }, function (err, result) {
                if (err) throw err;
                console.log(result);
            })

            console.log("email is verified");
            res.end("Email " + mailOptions.to + " is been Successfully verified");
        }
        else {
            console.log("email is not verified");
            res.end("Bad Request ");
        }
    }
    else {
        res.end("Request is from unknown source");
    }
});



app.get('/changepassword', function (req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            res.sendFile(path.join(__dirname + '/changepassword.html'));
        }
        else {
            console.log("email is not verified");
            res.end("Bad Request ");
        }
    }
    else {
        res.end("Request is from unknown source");
    }
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
})

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + '/register.html'));
})

app.get('/forgot-password', function (req, res) {
    res.sendFile(path.join(__dirname + '/forgot-password.html'));
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
})

app.get('/dashboard', function (req, res) {
    res.render('index.ejs', { name:datalogin.first_name+" "+datalogin.last_name });
})

app.get('/about', function (req, res) {
    res.render('about.ejs', { name:datalogin.first_name+" "+datalogin.last_name });
})

app.get('/pc', function (req, res) {
    res.render('pc.ejs', {name:datalogin.first_name+" "+datalogin.last_name });
})

app.get('/cell', function (req, res) {
    res.render('cell.ejs', { name:datalogin.first_name+" "+datalogin.last_name });
})

app.get('/404', function (req, res) {
    res.sendFile(path.join(__dirname + '/404.html'));
})
app.get('/profile', function (req, res) {
    res.render('prof.ejs', { name:datalogin.first_name+" "+datalogin.last_name,firstname: datalogin.first_name, lastname: datalogin.last_name, phonenum: datalogin.phone, country: datalogin.country, email: datalogin.email, city: datalogin.city, street: datalogin.street, zipcode: datalogin.zipcode });
})

app.get('/emailsent', function (req, res) {
    res.sendFile(path.join(__dirname + '/emailsent.html'));
})

app.get('/noemail', function (req, res) {
    res.sendFile(path.join(__dirname + '/noemail.html'));
})

app.get('/wrongpassword', function (req, res) {
    res.sendFile(path.join(__dirname + '/wrongpassword.html'));
})



/*
app.all('*', (req, res) => {
    return res.redirect('/404');
  });

*/
app.post('/login', function (req, res) {
    var flag = false;

    var email = req.body.Email;
    var pass = req.body.Pass;
    //read from data base
    db.collection("Users").findOne({ _id: email }, function (err, result) {
        if (err) throw err;
        console.log(result);


        if (result) {

            bcrypt.compare(pass, result.password, function (err, result1) {
                if (result1)
                    flag = true;
            });
        }
        setTimeout(function () {
            if (flag) {
                datalogin = result;
                return res.redirect('/dashboard');

            }
            else
                return res.redirect('/login');
        }, 1000);

    });




});

app.post('/updateProfile', function (req, res) {

    console.log(req.body.firstName);
    var firstname = req.body.firstName;
    var lastname = req.body.lastName;
    var email= req.body.email;
    var phone= req.body.phoneNum;
    var country= req.body.country;
    var city= req.body.city;
    var street= req.body.street;
    var zipcode= req.body.zipCode;

    db.collection("Users").updateOne({ _id: datalogin._id }, { $set: { first_name: firstname, last_name: lastname, email: email, phone: phone, country: country, city: city, street: street, zipcode: zipcode } }, function (err, result) {
        if (err) throw err;
        datalogin.first_name = firstname;
        datalogin.last_Name =lastname;
        datalogin.email= email;
        datalogin.country = country;
        datalogin.city= city;
        datalogin.street = street;
        datalogin.zipcode=  zipcode;
        datalogin.phone = phone;
        return res.redirect('/profile');

    });
});

//getting data from register
app.post('/register', function (req, res) {


    var firstname = req.body.FirstName;
    var lastname = req.body.LastName;
    var email = req.body.to;
    var pass = req.body.InputPassword;
    var promocode = req.body.PromoCode;

    db.collection("PromoCode").findOne({ PromoCode: promocode }, function (err, resultPromocode) {
        if (err) throw err;
        if (!resultPromocode) {
            promocode = "";
        }
    });


    // To encrypt passwords use bcrypt
    bcrypt.hash(pass, 12).then(hash => {

        var data = {
            "_id": email,
            "first_name": firstname,
            "last_name": lastname,
            "password": hash,
            "verifyEmail": false,
            "PromoCode": promocode

        }
        //read from data base
        db.collection("Users").findOne({ _id: email }, function (err, result) {
            if (err) throw err;
            console.log(result);


            //insert user to db
            if (result == null) {
                //send varification email
                rand = Math.floor((Math.random() * 100) + 54);
                host = req.get('host');
                link = "http://" + req.get('host') + "/verify?id=" + rand;


                const url = encryptor.encrypt(link);

                mailOptions = {
                    to: req.body.to,
                    subject: "Please confirm your Email account",
                    html: "Hello,Please Click on the link to verify your account." + url + ">Click here to verify"
                }
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.end("error");
                    } else {
                        console.log("Message sent: " + response.message);
                        res.end("sent");
                    }
                });

                //insert to data base
                db.collection('Users').insertOne(data, function (err, collection) {
                    if (err) throw err;
                    return res.redirect('/login');
                });
            }
            else {
                if (result.verifyEmail == false) {
                    //send varification email again
                    rand = Math.floor((Math.random() * 100) + 54);
                    host = req.get('host');
                    link = "http://" + req.get('host') + "/verify?id=" + rand;


                    const url = encryptor.encrypt(link);

                    mailOptions = {
                        to: req.body.to,
                        subject: "Please confirm your Email account",
                        html: "Hello,Please Click on the link to verify your account." + url + ">Click here to verify"
                    }
                    smtpTransport.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            console.log(error);
                            res.end("error");
                        } else {
                            console.log("Message sent: " + response.message);
                            res.end("sent");
                        }
                    });
                }

                return res.redirect('/login');
            }
        });
    });
});

app.post('/getProfile', async function (req, reso) {
    db.collection("Users").findOne({ _id: datalogin._id }, function (err, result) {

        if (err) throw err;
        dat = {
            firstName: result.first_name,
            lastName: result.last_name,
            email: result._id,
            country: result.country,
            city: result.city,
            street: result.street,
            zipCode: result.zipcode,
            phone: result.phone,
        }
        reso.send(dat);
    });
});


//getting data from forgot password 
app.post('/forgot-password', function (req, res) {

    var femail = req.body.forgotemail;
    console.log(femail);
    db.collection("Users").findOne({ _id: femail }, function (err, result) {
        if (err) throw err;
        if (result.verifyEmail) {
            rand = Math.floor((Math.random() * 100) + 54);
            host = req.get('host');
            console.log(host);
            link = "http://" + req.get('host') + "/changepassword?id=" + rand;
            const url = encryptor.encrypt(link);

            mailOptions = {
                to: req.body.forgotemail,
                subject: "Change password request",
                html: "Hello,Please Click on the link to change your password." + url + ">Click here to change"
            }
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    passwordChangeEmail = req.body.forgotemail;
                    console.log("Message sent: " + response.message);
                    return res.redirect('/emailsent');
                }
            });

        }
        else {
            return res.redirect('/noemail');
        }
    });

});


app.post('/changepassword', function (req, res) {

    var femail = passwordChangeEmail;
    var pass = req.body.InputPassword;
    console.log(femail);

    bcrypt.hash(pass, 12).then(hash => {
        db.collection("Users").updateOne({ _id: femail }, { $set: { password: hash } }, function (err, result) {
            if (err) throw err;
            console.log(result);
            mailOptions = {
                to: femail,
                subject: "Password Updated",
                html: "Hello,your password updated successfully."
            }
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    passwordChangeEmail = req.body.forgotemail;
                    console.log("Message sent: " + response.message);
                    return res.redirect('/login');
                }
            });
        })
    });


});


app.post('/updatePassword', function (req, res) {
    var femail = datalogin._id;
    var pass = req.body.password;
    var oldpass = req.body.oldPass;
    var flag = false;
    console.log(req.body.oldPass);
    bcrypt.hash(pass, 12).then(hash => {
        db.collection("Users").findOne({ _id: femail }, function (err, res) {
            if (err) throw err;
            bcrypt.compare(oldpass, res.password, function (err, result) {
                if (err) throw err;
                if (result) {
                    db.collection("Users").updateOne({ _id: femail }, { $set: { password: hash } }, function (err, res) {
                        if (err) throw err;
                        flag = true;
                        mailOptions = {
                            to: femail,
                            subject: "Password Updated",
                            html: "Hello,your password updated successfully."
                        }
                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                console.log(error);
                                res.end("error");
                            } else {
                                passwordChangeEmail = req.body.forgotemail;
                                console.log("Message sent: " + response.message);
                                return res.redirect('/profile');
                            }
                        });
                    })
                }
            });
        })
    });
    setTimeout(function () {
        console.log(flag);
        if (flag)
            return res.redirect('/profile');
        else
            return res.redirect('/wrongpassword');
    }, 1000);


});
server.listen(port);
// app.listen(port);
console.log('Server started! At http://localhost:' + port);

/*
            //update data base
      db.collection("Users").updateOne({_id: email},{$set : {last_name : "cohen",first_name : "moshe",address : "haifa"}}, function(err, result) {
        if (err) throw err;
        console.log(result);
    })
    
*/

/*
        //delete one from data base
        db.collection("Users").deleteOne({first_name: "sds"}, function(err, result) {
            if (err) throw err;
            console.log(result);
        })
*/