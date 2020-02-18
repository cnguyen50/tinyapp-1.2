const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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


// redirect after form submission
app.post("/urls", (req, res) => {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = `http://${req.body.longURL}`;
    res.redirect(`/urls/${shortURL}`);
});

// delete url and redirect to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls")
})


// redirects to actual website 
app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});
  

//rendered Create new TnyURL
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});


//rendered TinyURL: longURL shortURL: shortURL
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

//short/long urls with stylesheet 
app.get("/urls", (req, res) => {
    let templateVars = { urls : urlDatabase };
    res.render("urls_index", templateVars);
});


//printed on terminal
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
