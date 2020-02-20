const { assert } = require('chai');

const { checkEmail } = require('../helpers');

const testUsers = {
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

describe('checkEmail', function() {
    it('should return true valid email', () => {
      const user = checkEmail("user@example.com", testUsers);
      const expected = "userRandomID";
      assert.deepEqual(user.id, expected);
    });
  
    it('should return undefined with an invaild email', () => {
      const user = checkEmail("user1234@example.com", testUsers)
      const expected = undefined;
      assert.deepEqual(user, expected);
    });
  
  });
  