const express = require("express");
const app = express();
const PORT = 8080;
const cookieP = require("cookie-parser");
app.use(cookieP());
// converts body from buffer to string that can be read
// It then adds the data to the request object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const generateRandomString = function(char) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < char; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generateRandomID = function(char) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < char; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Shortened URL Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// User Database
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
  let templateVars = { username: req.cookies.user_id, };
  res.render("urls_new", templateVars);
});

// Passing the shortURL in the browser (providing the longURL is defined), will return the request back using the template in the urls_show file.
// shortURL is declared when passing the shortURL in the browser, so the longURL is be defined using shortURL as the object key
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.user_id,  };
  res.render("urls_show", templateVars);
});

// Redirecting the short URL to actual longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// new route handler that passes the urls.index file the URL data via res.render when /url is requested
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
    username: req.cookies.user_id,
  };
  res.render("urls_index", templateVars);
});

// Registration Page
app.get('/register', (req, res) => {
  // let templateVars = { username: req.cookies.user_id.email,
  // };
  res.render("urls_register");
});


app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
 
  // Obj.values returns values within an array
  // .indexOf the longURL returns the element index number
  // If the index number is more that -1 then the URL already exists
  if (Object.values(urlDatabase).indexOf(longURL) > -1) {

    // Looping over urlDatabase object comparing each key value with the longURL provided
    for (const key in urlDatabase) {

      // if theres a match then key is used to redirect the to the page for that URL
      if (urlDatabase[key] === longURL) {
        res.redirect(`urls/${key}`);
      }
    }
  } else {
    let shortURL = generateRandomString(6);
    urlDatabase[shortURL] = longURL;
    res.redirect(`urls/${shortURL}`);
  }
});

//Register Account
app.post('/register', (req, res) => {
  let userID = generateRandomID(4);
  users[userID] = { id: userID, 
                    email: req.body.email,
                    password: req.body.password 
                  };
  let email = users[userID]["email"]
  res.cookie("user_id", email);
  console.log(email)
  res.redirect("/urls")
});

// Login
app.post('/login', (req, res) => {
  res.cookie("user_id", req.body.username);
  res.redirect("/urls");

});

//Logout
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");

});

// Edit URL
app.post('/urls/:id', (req, res) => {
  console.log(req.body.editURL);
  let longURL = req.body.editURL;
  let shortURL = req.params.id;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls`);
});

// Delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

// Using EXPRESS to listen port request and Printing message to to notify of listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});