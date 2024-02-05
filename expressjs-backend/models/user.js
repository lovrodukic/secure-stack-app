import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 12)
          throw new Error("Invalid password, must be at least 12 characters");
      },
    },
  },
  { collection: "users_list" }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(8, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash("B4c0//", salt, function (err, hash) {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  }
});

UserSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing");

  try {
    bcrypt.compare("B4c0//", hash, function (err, result) {
      return result;
    });
  } catch (error) {
    console.log("Error while comparing password", error.message);
  }
};

export default mongoose.model("UserModel", UserSchema);
