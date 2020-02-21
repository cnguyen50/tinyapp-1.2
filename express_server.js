const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { checkEmail } = require('./helpers.js');
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


const urlsForUser = function(id) {
  let match = {};
  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      match[key] = urlDatabase[key].longURL;
    }
  }
  return match;
};


const generateRandomString = function() {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = chars.length;
  for (let i = 1; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


app.post("/urls/:shortURL", (req, res) => {
  let users = req.session.user_id;
  urlDatabase[req.params.shortURL] = {
    longURL: `http://${req.body.newURL}`,
    userID:  users
  };
  res.redirect("/urls");
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let users = req.session.user_id;

  urlDatabase[shortURL] = {
    longURL: `http://${req.body.longURL}`,
    userID:  users
  };
  res.redirect(`/urls/${shortURL}`);
});


app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user = checkEmail(email, users);

  if (!user) {
    res.status(403).send("Email isnt registered");
  } else if (!bcrypt.compareSync(req.body.password, users[user.id].password)) {
    res.status(403).send("Passwords do not match");
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

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


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
  

app.get("/urls/new", (req, res) => {
  let userID = req.session["user_id"];
  let templateVars = { user_id: users[userID] };
  if (!templateVars.user_id) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});


app.get("/register", (req, res) => {
  res.render("urls_register");
});


app.get("/login", (req, res) => {
  res.render("urls_login");
});

app.get("/", (req, res) => {
  let userID = req.session["user_id"];
  let templateVars = { user_id: users[userID] };
  if (!templateVars.user_id) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user_id: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    urls : urlsForUser(req.session.user_id),
    user_id: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
