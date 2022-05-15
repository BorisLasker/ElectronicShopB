function ValidateForm(email,pass,repass){

    var flag= ValidateEmail(email)&&CheckPassword(pass)&&CheckPassMatch(pass,repass);
    if (flag){ 

      
        alert('You succeeded!\nPlease check your mail address.')
        window.location.href = "login.html";
        return true;
    }
    return false;
}


function CheckPassMatch(pass,repass){

    if(pass===repass)
        return true; 
     alert('The passwords do not match')
     return false;                                          href="login.html";

    

}

function CheckPassword(inputtxt) 
{ 
  var pass=  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  if(inputtxt.match(pass)) 
  { 
    return true;
  }
  else
  { 
    alert('Password needs to be:\n-Minimum 6 Characters\n-Must Include an Uppercase Character\n-Must Include an Lowercase Character\n-Must Include a Number\n-Must Include a Special Character')
    return false;
  }
}

function ValidateEmail(mail)
{
  var mailformat =/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  if(mail.match(mailformat))
  {
      return true;
  }
  else
  {
    alert("You have entered an invalid email address!");    //The pop up alert for an invalid email address
    return false;
  }
}