const getUserByEmail = function(email, database) {
 
  for (const key in database) {
    let databaseEmail = database[key]["email"];
  
    if (databaseEmail === email) {
      return database[key]["userID"];
    }
  }
};

module.exports = getUserByEmail;