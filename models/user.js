const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email) {
    this.email = email;
    this.name = username;
  }

  save() {
    const db = getDb();
    return db
      .collections("users")
      .insertOne(this)
      .then((res) => res)
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((res) => res)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
