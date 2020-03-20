const getUserByEmail = function(email, database) {
  let exists = false
  let Email;

  for (const key in database) {
    Email = database[key]["email"];

  } if (Email === email) {
    exists = datatbase[key]["userID"];
  }
  return exists;
};

module.exports = getUserByEmail;