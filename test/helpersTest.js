const  { assert } = require('chai');

const getUserByEmail = require('../helper.js');

const testUsers = {
  "userRandomID": {
    userID: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    userID: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    
    
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
   
    assert.equal(user, expectedOutput);
  });
  it('should return undefined with invalid email', function() {
    
    
    const user = getUserByEmail("uer@example.com", testUsers)
    const expectedOutput = undefined;
   
    assert.equal(user, expectedOutput);
  });
  it('should return undefined with no email', function() {
    
    
    const user = getUserByEmail("", testUsers)
    const expectedOutput = undefined;
   
    assert.equal(user, expectedOutput);
  });
});

