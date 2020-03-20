const express = require("express");
const getUserByEmail = require("./helper");
const app = express();
const PORT = 8080;
const cookieP = require("cookie-session");
app.use(cookieP({
  name: 'session',
  keys: ['cookie-monster'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// converts body from buffer to string that can be read
// It then adds the data to the request object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const bcrypt = require('bcrypt');


// Databases --------------------------------------------------------------------------------------------------------------------

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
};

// Shortened URL Database template
const urlDatabase = {
  aaAaaa: {
    longURL: "http://www.bbc.co.uk",
    userID: "aaaAaa"
  }
};

// Functions ---------------------------------------------------------------------------------------------------------------------

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

const urlsForUser = function(id) {
  let urlDB = {};

  for (const key in urlDatabase) {
    if (urlDatabase[key]["userID"] === id) {
      urlDB[key] = { longURL: urlDatabase[key]["longURL"] };
    }
  }
  return urlDB;
};

const loginCheck = (email, password) => {
  let answer = false;

  for (const id in users) {
    let hashedPassword = users[id]["password"];
    let mail = users[id]["email"];
    
    if (bcrypt.compareSync(password, hashedPassword) && email === mail) {
      answer = users[id]["id"];
    }
  }
  return answer;
};

// Requests and Posts -------------------------------------------------------------------------------------------------------

// Tells the express application to use EJS as template engine
app.set("view engine", "ejs");

// Login Page
app.get("/login", (req, res) => {
  let templateVars = { userId: req.session.userId };
  res.render("login", templateVars);
});

// If request is received with /urls.json path, the urlDatabase object will be the response back to the listener
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// HTML markup used with output string, can cause issues
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body</html>\n");
});

// Route Handler - Hello
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Route handler - new URL and use the formatting from urls_new
app.get("/urls/new", (req, res) => {
  
  if (req.session.userId) {
    let templateVars = { userId: req.session.userId, };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Passing the shortURL in the browser, will return the request using urls_show template.
// the longURL is be defined using shortURL as the object key
app.get("/urls/:shortURL", (req, res) => {
  if (req.session.userId) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]["longURL"],
      userId: req.session.userId,
    };
    res.render("urls_show", templateVars);
  } else {
    res.send("Please Login or Register a New Account");
  }
});

// Redirecting the short URL to actual longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

// Route Handler request urls and renders ur_index
app.get("/urls", (req, res) => {
  if (req.session.userId) {
    let result = urlsForUser(req.session.userId);
    let templateVars = { urls: result,
      userId: req.session.userId,
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});



// Registration Page
app.get('/register', (req, res) => {
  let templateVars = { userId: req.session.userId,
  };
  res.render("urls_register", templateVars);
});

// Existing URL
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let urlExists = false;
  // Obj.values returns values within an array
  // .indexOf the longURL returns the element index number
  // If the index number is more that -1 then the URL already exists
  
  // Looping over urlDatabase object comparing each key value with the longURL provided
  for (const key in urlDatabase) {
    
    // if theres a match then key is used to redirect the to the page for that URL
    if (urlDatabase[key]["longURL"] === longURL) {
      urlExists = true;
      res.redirect(`urls/${key}`);
    }
  }
  if (urlExists === false) {
    let shortURL = generateRandomString(6);
    urlDatabase[shortURL] = { longURL: longURL, userID: req.session.userId};
    res.redirect(`urls/${shortURL}`);
  }
});

//Register Account
app.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email === "" || password === "") {
    res.status(400).sendFile("/vagrant/w3/tinyApp/tinyapp/Images/400.jpeg");
  }
  if (getUserByEmail(email, users) === true) {
    res.status(400).sendFile("/vagrant/w3/tinyApp/tinyapp/Images/400.jpeg");
  } else {
    
    let userID = generateRandomID(4);
    users[userID] = { id: userID,
      email: req.body.email,
      password: hashedPassword };

    req.session.userId = users[userID].id;
      
    res.redirect("/urls");
  }
  
});

// Login
app.post('/login', (req, res) => {
  if (loginCheck(req.body.email, req.body.password)) {
    let userID = loginCheck(req.body.email, req.body.password);

    req.session.userId = userID;
    
    res.redirect("/urls");
  } else {
    res.status(403).sendFile("/vagrant/w3/tinyApp/tinyapp/Images/403.jpeg");
  }
});

//Logout
app.post('/logout', (req, res) => {
  req.session = null;
  
  res.redirect("/login");
});

// Edit URL
app.post('/urls/:id', (req, res) => {
  let longURL = req.body.editURL;
  let shortURL = req.params.id;
  let userCookieID = req.session.userId;

  if (urlDatabase[shortURL]["userID"] === userCookieID) {
    urlDatabase[shortURL]["longURL"] = longURL;
    res.redirect(`/urls`);
  } else {
    res.status(403).sendFile("/vagrant/w3/tinyApp/tinyapp/Images/403.jpeg");
  }
});

// Delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  let shortURL = req.params.shortURL;
  let userCookieID = req.session.userId;

  if (urlDatabase[shortURL]["userID"] === userCookieID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`);
  } else {
    res.status(403).sendFile("/vagrant/w3/tinyApp/tinyapp/Images/403.jpeg");
  }
});

// Using EXPRESS to listen port request and Printing message to to notify of listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});