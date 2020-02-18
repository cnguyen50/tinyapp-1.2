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



const generateRandomString = function() {
    let result = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = chars.length;
    for (let i = 1; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

app.post("/urls", (req, res) => {
    console.log(req.body);  // Log the POST request body to the console
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

//urlsDatabase pairs on the browser
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
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
