function generateRandomString() {

}
const express = require("express");
const app = express();
const PORT = 8080;

// converts body from buffer to string that can be read
// It then adds the data to the request object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Database of all the shortened URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Tells the express application to use EJS as template engine
app.set("view engine", "ejs");

// If request is received with /urls.json path, the urlDatabase object will be the response back to the listener
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// HTML markup used with output string, can cause issues
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body</html>\n");
});

// Same as requestHandler in app.js, if request is received with no path after URL, Hello will be the response back to the listener
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Add a route handler to retrieve a new URL and use the formatting from urls_new
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Passing the shortURL in the browser (providing the longURL is defined), will return the request back using the template in the urls_show file.
// shortURL is declared when passing the shortURL in the browser, so the longURL is be defined using shortURL as the object key
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// new route handler that passes the urls.index file the URL data via res.render when /url is requested
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");        
});

// Using EXPRESS to listen port request and Printing message to to notify of listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
