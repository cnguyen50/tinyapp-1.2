const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

//setting up EJS template engine
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//urlsDatabase pairs on the browser
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });


app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});


  //TinyURL: longURL shortURL: shortURL
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

//short/long urls with stylesheet 
app.get("/urls", (req, res) => {
    let templateVars = { urls : urlDatabase };
    res.render("urls_index", templateVars);
});


//Hello World on the browser
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});  


//Hello! on browser
app.get("/", (req, res) => {
  res.send("Hello!");
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
