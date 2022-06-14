const express = require("express");
const app = express();
var port = process.env.PORT || 8080;
var path = require('path');
const bodyParser=require("body-parser");
app.use(express.static(__dirname));  //specifies the root directory from which to serve static assets [images, CSS files and JavaScript files]
app.use(bodyParser.urlencoded({extended:true})); //parsing bodies from URL. extended: true specifies that req.body object will contain values of any type instead of just strings.
app.use(bodyParser.json()); //for parsing json objects
var nodemailer = require("nodemailer");
var request = require('request');


var mongoose = require("mongoose");
const { verify } = require("crypto");
var MONGODB_URI = process.env.MONGODB_URI ||'mongodb+srv://Boris:braude123@electronicshop.c4fhf.mongodb.net/ElectronicShop?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
var db=mongoose.connection;

var bcrypt = require('bcryptjs');

const urlEncrypt = require('url-encrypt');

const encryptor = urlEncrypt({secretKey: 'some-secret-key'});

rand=Math.floor((Math.random() * 100) + 54);

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "electronicshoptask@gmail.com",
        pass: "iqyhbkfnslcuaiyr"
    }
});
var rand,mailOptions,host,link;


app.post('/send',function(req,res){
   

    });


    app.get('/verify',function(req,res){
        console.log(req.protocol+":/"+req.get('host'));
        if((req.protocol+"://"+req.get('host'))==("http://"+host))
        {
            console.log("Domain is matched. Information is from Authentic email");
            if(req.query.id==rand)
            {
                //update data base
                db.collection("Users").updateOne({_id: mailOptions.to},{$set : {verifyEmail : "true"}}, function(err, result) {
                    if (err) throw err;
                    console.log(result);
                })

                console.log("email is verified");
                res.end("Email "+mailOptions.to+" is been Successfully verified");
            }
            else
            {
                console.log("email is not verified");
                res.end("Bad Request ");
            }
        }
        else
        {
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

//getting data from register
app.post('/register', function(req,res){

    /*
// g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  
  // Put your secret key here.
  var secretKey = "6LcESRYgAAAAABpJ-Jsh9La7kLYOFjJh0yQchYBG";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
  });

*/
/*
//read from data base
db.collection("Users").findOne({_id: req.query.to},{verifyEmail : "true"}, function(err, result) {
    
    if (err) throw err;
    if(!result){
        
        rand=Math.floor((Math.random() * 100) + 54);
        host=req.get('host');
        link="http://"+req.get('host')+"/verify?id="+rand;


        const url = encryptor.encrypt(link);

        mailOptions={
            to : req.query.to,
            subject : "Please confirm your Email account",
            html : "Hello,Please Click on the link to verify your account."+url+">Click here to verify"
        }
        smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
                console.log(error);
            res.end("error");
        }else{
                console.log("Message sent: " + response.message);
            res.end("sent");
            }
    });

    
    }
    else {
        return res.redirect('/register');
    }   
  });
*/
    var firstname = req.body.FirstName;
    var lastname = req.body.LastName;
    var email = req.body.to;
    var pass = req.body.InputPassword;


    // To encrypt passwords use bcrypt
    bcrypt.hash(pass, 12).then(hash => {

        var data = {
            "_id": email,
            "first_name": firstname,
            "last_name" : lastname,
            "password":hash
        }
        //read from data base
        db.collection("Users").findOne({_id: email},{verifyEmail : "true"}, function(err, result) {
            if (err) throw err;
            console.log(result);
    
            if(!result){
                //send varification email
                rand=Math.floor((Math.random() * 100) + 54);
                host=req.get('host');
                link="http://"+req.get('host')+"/verify?id="+rand;
        
        
                const url = encryptor.encrypt(link);
        
                mailOptions={
                    to : req.body.to,
                    subject : "Please confirm your Email account",
                    html : "Hello,Please Click on the link to verify your account."+url+">Click here to verify"
                }
                smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                        console.log(error);
                    res.end("error");
                }else{
                        console.log("Message sent: " + response.message);
                    res.end("sent");
                    }
            });


                //insert to data base
                  db.collection('Users').insertOne(data,function(err, collection){
                    if (err) throw err;
                    return res.redirect('/register');
                });
            }
            else {
               
                return res.redirect('/register');
            }   
          });
        });
});


        
//getting data from forgot password 
app.post('/forgot-password', function(req,res){

    var femail = req.body.forgotemail;
    db.collection("Users").findOne({_id: femail}, function(err, result) {
        if (err) throw err;
        console.log(result);
        if(result){
            rand=Math.floor((Math.random() * 100) + 54);
            host=req.get('host');
            link="http://"+req.get('host')+"/verify?id="+rand;
                    
            const url = encryptor.encrypt(link);
        
            mailOptions={
                to : femail,
                subject : "Please confirm your Email account",
                html : "Hello,Please Click on the link to change your password."+url+">Click here to change"
            }
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                        console.log(error);
                    res.end("error");
                }else{
                        console.log("Message sent: " + response.message);
                    res.end("sent");
                    }
            });
        }
    });
    
});
app.listen(port);
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