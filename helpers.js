//returns email if it exists in the database
const checkEmail = function(email, database) {
  for (let id in database) {
    if (database[id].email === email) {
      return database[id];
    }
  }
  return undefined;
};

//returns urls for individual users
const urlsForUser = function(id, database) {
  let match = {};
  for (const key in database) {
    if (database[key].userID === id) {
      match[key] = database[key].longURL;
    }
  }
  return match;
};

//creates a random string for shortURL
const generateRandomString = function() {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = chars.length;
  for (let i = 1; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


module.exports = { checkEmail,urlsForUser, generateRandomString };