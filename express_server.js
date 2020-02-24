const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { checkEmail,urlsForUser, generateRandomString } = require('./helpers.js');
const app = express();
const PORT = 8080;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["key1"],
}));

const users = {};

const urlDatabase = {};

//allows user to edit URLS
app.post("/urls/:shortURL", (req, res) => {
  let users = req.session.user_id;

  if (!users) {
    res.status(400).send("Need to login for access");
  } else {

    urlDatabase[req.params.shortURL] = {
      longURL: req.body.newURL,
      userID:  users
    };
    res.redirect("/urls");
  }
});

//deletes longurl 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//creates new shorturl and adds new key
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let users = req.session.user_id;

  if(!users) {
    res.status(400).send("Access denied, unable to perform action");
    res.redirect("/login");
  } else {
    
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID:  users
    };
    res.redirect(`/urls/${shortURL}`);
  }

});

//checks cookie and password if matchs then req prev session
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user = checkEmail(email, users);

  if (!user) {
    res.status(403).send("Email isnt registered");
    res.redirect("/register");
  } else if (!bcrypt.compareSync(req.body.password, users[user.id].password)) {
    res.status(403).send("Passwords do not match");
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

//clears cookies and redirects to /urls
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//creates new userID and hashes passwrod and redirects to /urls
app.post("/register", (req, res) => {
  let newUserID = generateRandomString();
  if (checkEmail(req.body.email, users)) {
    res.status(403).send("403 Emails been registered");
  } else {
    if (req.body.email && req.body.password) {
      users[newUserID] = {
        id: newUserID,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      };
      req.session.user_id = newUserID;
      res.redirect("/urls");
    } else {
      res.status(400);
      res.send("Empty email and password field");
    }
  }
});

// redirects to actual website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
  
//able to create new 
app.get("/urls/new", (req, res) => {
  let userID = req.session["user_id"];
  let templateVars = { user_id: users[userID] };
  if (!templateVars.user_id) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

//renders register page
app.get("/register", (req, res) => {
  res.render("urls_register");
});

//renders login page
app.get("/login", (req, res) => {
  res.render("urls_login");
});

//root path, if logged in then redirect to urls
app.get("/", (req, res) => {
  let userID = req.session["user_id"];
  let templateVars = { user_id: users[userID] };
  if (!templateVars.user_id) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

//renders tinyURL, shortURL and edit button
app.get("/urls/:shortURL", (req, res) => {

  if (!req.session.user_id) {
    res.status(400).send("Need to Login to edit");
  }

  if (!urlDatabase[req.params.shortURL]) {
    res.status(400).send("URL doesnt exists in the database");
  }

  if(req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(400).send("Cannot edit this URL")
  }

  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user_id: users[req.session.user_id]
  };

  res.render("urls_show", templateVars);
});

//renders urls page 
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      urls : urlsForUser(req.session.user_id, urlDatabase),
      user_id: users[req.session.user_id]
    };
    res.render("urls_index", templateVars);
    
  }
    
});

//msg on terminal
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

