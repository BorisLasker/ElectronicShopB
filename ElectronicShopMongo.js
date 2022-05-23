const express = require("express");
const app = express();
var port = process.env.PORT || 8080;
var path = require('path');
const bodyParser=require("body-parser");
app.use(express.static(__dirname));  //specifies the root directory from which to serve static assets [images, CSS files and JavaScript files]
app.use(bodyParser.urlencoded({extended:true})); //parsing bodies from URL. extended: true specifies that req.body object will contain values of any type instead of just strings.
app.use(bodyParser.json()); //for parsing json objects
var nodemailer = require("nodemailer");



var mongoose = require("mongoose");
const { verify } = require("crypto");
var MONGODB_URI = process.env.MONGODB_URI ||'mongodb+srv://Boris:braude123@electronicshop.c4fhf.mongodb.net/ElectronicShop?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
var db=mongoose.connection;




rand=Math.floor((Math.random() * 100) + 54);

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    port: port,
    auth: {
        user: "electronicshoptask@gmail.com",
        pass: "electronic1!"
    }
});
var rand,mailOptions,host,link;


app.get('/send',function(req,res){
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    mailOptions={
        to : req.query.to,
        subject : "Please confirm your Email account",
        html : "Hello,Please Click on the link to verify your email."+link+">Click here to verify"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
            console.log(error);
        res.end("error");
    }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
        }
    });
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


//getting data from register
app.post('/register', function(req,res){
    var firstname = req.body.FirstName;
    var lastname = req.body.LastName;
    var email = req.body.to;
    var pass = req.body.InputPassword;
    var data = {
        "_id": email,
        "first_name": firstname,
        "last_name" : lastname,
        "password":pass

    }
    //read from data base
    db.collection("Users").findOne({_id: email}, function(err, result) {
        if (err) throw err;
        console.log(result);

        if(!result){

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

})
    

app.listen(port);
console.log('Server started! At http://localhost:' + port);

