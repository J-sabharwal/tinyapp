const express = require("express");
const app = express();
const PORT = 8080;


// Database of all the shortened URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Same as requestHandler in app.js, if request is received with no path after URL, Hello will be the response back to the listener
app.get("/", (req, res) => {
  res.send("Hello!");
});

// new route handler that passes the urls.index file the URL data via res.render when /url is requested
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Tells the express application to use EJS as template engine
app.set("view engine", "ejs");

// If request is received with /urls.json path, the urlDatabase object will be the response back to the listener
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Passing the shortURL in the browser (providing the longURL is defined), will return the request back using the template in the urls_show file.
// shortURL is declared when passing the shortURL in the browser, so the longURL is be defined using shortURL as the object key
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// HTML markup used with output string, can cause issues
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body</html>\n");
});

// Using EXPRESS to listen port request and Printing message to to notify of listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});