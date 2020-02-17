const express = require("express");
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//setting up EJS template engine
app.set("view engine", "ejs");


//urlsDatabase pairs on the browser
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
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
