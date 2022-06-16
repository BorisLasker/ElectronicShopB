function ValidateForm(email, phone, fname, lname, country, city, street, zipcode) {

  var mailformat = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  if (email == "" || fname == "" || lname == "" || phone == "" || country == "" || city == "" || street == "" || zipcode == "")
  {
    alert("All field should not be empty.");  
    return false;
  }
  if (!email.match(mailformat)) {
    alert("You have entered an invalid email address!");    //The pop up alert for an invalid email address
    return false;
  }
  if (phone.value.length != 10) {
    alert("Phone should be 10 digits length.");
    return false;
  }
  return true;
}

function CheckPassMatch(pass, repass) {

  if (pass === repass)
    return true;
  alert('The passwords do not match')
  return false; href = "login.html";



}

function CheckPassword(inputtxt) {
  var pass = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  if (inputtxt.match(pass)) {
    return true;
  }
  else {
    alert('Password needs to be:\n-Minimum 6 Characters\n-Must Include an Uppercase Character\n-Must Include an Lowercase Character\n-Must Include a Number\n-Must Include a Special Character')
    return false;
  }
}

function ValidateEmail(mail) {
  var mailformat = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  if (mail.match(mailformat)) {

    return true;
  }
  else {
    alert("You have entered an invalid email address!");    //The pop up alert for an invalid email address
    return false;
  }
}

function ValidatePassword(pass, repass) {
  var flag = CheckPassword(pass) && CheckPassMatch(pass, repass);
  if (flag) 
    return true;
  return false;
}
