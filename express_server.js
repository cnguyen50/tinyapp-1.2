const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const checkEmail = function(email, ) {
    for (let id in users) {
        if (users[id].email === email) {
            return users[id];
        }
    }
    return false;
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

// edits url and redirects after edit submission
app.post("/urls/:shortURL", (req, res) => {
    urlDatabase[req.params.shortURL] = `http://${req.body.newURL}`;
    res.redirect("/urls")
});

// delete url and redirect to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
})

// redirects to actual website 
app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

// redirect after form submission
app.post("/urls", (req, res) => {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = `http://${req.body.longURL}`;
    res.redirect(`/urls/${shortURL}`);
});

//sets a cookie to userID for new user 
app.post("/login", (req, res) => {
    let newEmail = req.body.email;
    let user = checkEmail(newEmail);

        if (!user) {
            res.status(403).send("Emails do not match");
        } else if (user.password !== req.body.password ) {
            res.status(403).send("Passwords do not match");
        } else {
            res.cookie("user_id", user.id);
            res.redirect("/urls");
        }
});

// clears username cookies and redirects to /urls
app.post("/logout", (req, res) => {
    res.clearCookie('username');
    res.redirect("/urls");
});

app.post("/register", (req, res) => {
    let newUserID = generateRandomString();
    if (req.body.email && req.body.password) {
        users[newUserID] = { 
            id: req.body.id,
            email: req.body.email,
            password: req.body.password };
 
        res.cookie("user_id", req.body.email);
        console.log(req.body.email)
        res.redirect("/urls");
    } else {
        res.status(400);
        res.send("Empty email and password field");
    }
});

  
//rendered Create new TinyURL
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

//renders register page
app.get("/register", (req, res) => {
    res.render("urls_register");
});

//renders login page
app.get("/login", (req, res) => {
    res.render("urls_login");
});


//rendered TinyURL: longURL shortURL: shortURL
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["user_id"] };
  res.render("urls_show", templateVars);
});

//short/long urls with stylesheet 
app.get("/urls", (req, res) => {
    let templateVars = { urls : urlDatabase, username: req.cookies["user_id"] };
    res.render("urls_index", templateVars);
});

//printed on terminal
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
