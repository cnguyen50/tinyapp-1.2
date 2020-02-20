const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };


const urlDatabase = {
    b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
    i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


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

const urlsForUser = function(id) {
    let match = {};

    for (const key in urlDatabase) {
        if (urlDatabase[key].userID === id ) {
            match[key] = urlDatabase[key].longURL;
        }
    }
    return match;
}

const checkEmail = function(email) {
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

    let users = req.cookies.user_id
    urlDatabase[req.params.shortURL] = {
        longURL: `http://${req.body.newURL}`,
        userID:  users
    }
    res.redirect("/urls")
});

// delete url and redirect to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
})


// redirect after form submission
app.post("/urls", (req, res) => {
    let shortURL = generateRandomString();
    let users = req.cookies.user_id

    urlDatabase[shortURL] = {
        longURL: `http://${req.body.longURL}`,
        userID:  users
    }
    res.redirect(`/urls/${shortURL}`);
});

//sets a cookie to userID for new user 
app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user = checkEmail(email);
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("test at else:", password)
    console.log("test for hashed", hashedPassword)

    if (email === "" || password === "") {
        res.status(403).send("Enter valid fields please");
    } else {
        if (!user) {
            res.status(403).send("Emails do not match");
        }
        if (!bcrypt.compareSync(password, hashedPassword)) {
            res.status(403).send("Passwords do not match");
        } else {
            res.cookie("user_id", user.id);
            res.redirect("/urls");
        }
    }    
});

// clears username cookies and redirects to /urls
app.post("/logout", (req, res) => {
    res.clearCookie('user_id');
    res.redirect("/urls");
});

app.post("/register", (req, res) => {
    let newUserID = generateRandomString();
    if (checkEmail(req.body.email)) {
        res.status(403).send("403 Emails been registered");
    } else {
        if (req.body.email && req.body.password) {
            users[newUserID] = { 
                id: newUserID,
                email: req.body.email,
                password: req.body.password };
     
            res.cookie("user_id", newUserID);
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
  
//rendered Create new TinyURL
app.get("/urls/new", (req, res) => {
    let userID = req.cookies["user_id"]
    let templateVars = { user_id: users[userID] }
    res.render("urls_new", templateVars);
});

//renders register page
app.get("/register", (req, res) => {
    let userID = req.cookies["user_id"]
    let templateVars = { user_id: users[userID] }
    res.render("urls_register", templateVars);
});

//renders login page
app.get("/login", (req, res) => {
    let userID = req.cookies["user_id"]
    let templateVars = { user_id: users[userID] }
    res.render("urls_login", templateVars);
});


//rendered TinyURL: longURL shortURL: shortURL
app.get("/urls/:shortURL", (req, res) => {
    let userID = req.cookies["user_id"]
    let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longURL, user_id: users[userID] };
    res.render("urls_show", templateVars);
});

//short/long urls with stylesheet 
app.get("/urls", (req, res) => {
    let userID = req.cookies["user_id"];
    let newURLs = urlsForUser(userID);
    let templateVars = {
        urls : newURLs,
        user_id: users[userID] };
    res.render("urls_index", templateVars);
});

//printed on terminal
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
