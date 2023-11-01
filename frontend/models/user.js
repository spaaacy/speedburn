import {Schema, models, model} from "mongoose";

const UserSchema = Schema({
  address: {
    type: String,
    unique: [true, "Address already registered"],
    required: [true, "Address must be provided"],
  },
  username: {
    type: String,
    required: [true, "Username must be provided"],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
    ],
  },
  image: {
    type: String,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
