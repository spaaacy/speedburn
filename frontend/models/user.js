import {Schema, models, model} from "mongoose";

export const UserSchema = Schema({
  address: {
    type: String,
    unique: [true, "Address already registered"],
    required: [true, "Address must be provided"],
  },
  username: {
    type: String,
    // TODO: Look into the regex criteria
    // match: [
    //   /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    //   "Username invalid, it should contain 4-20 alphanumeric letters and be unique!",
    // ],
  },
  image: {
    type: String,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
