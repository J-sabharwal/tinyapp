const getUserByEmail = function(email, database) {
  let Email;
 
  for (const key in database) {
    Email = database[key]["email"];
  
   if (Email === email) {
    return database[key]["userID"];
    }
  }
};

module.exports = getUserByEmail;