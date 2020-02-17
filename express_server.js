const express = require("express");
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//setting template engine
app.set("view engine", "ejs");

//urlsDatabase pairs on the browser
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
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
  console.log(`Example app listening on port ${PORT}!`);
});