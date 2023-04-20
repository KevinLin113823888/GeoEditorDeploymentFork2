const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String, 
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  key: {
    type: String, 
    required: true
  },
  passwordRecoveryCode: {
    type: String,
  },
  ownedMapCards: {
    type: [Schema.Types.ObjectId],
    required: true
  }, 
  blockedUsers: {
    type: [Schema.Types.ObjectId], 
    required: true
  }, 
  usersFollowing: {
    type: [Schema.Types.ObjectId], 
    required: true
  }
});

module.exports = mongoose.model("userInfoSchema", userInfoSchema);