const checkEmail = function(email, database) {
  for (let id in database) {
    if (database[id].email === email) {
      return database[id];
    }
  }
  return undefined;
};



module.exports = {checkEmail};