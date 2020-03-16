const express = require("express");
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.goog.le.com"
};

// Same as requestHandler in app.js, if request is received with not path after URL, Hello will be the response back to the listener
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Using EXPRESS to listen port request and Printing message to to notify of listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});