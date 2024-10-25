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

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    let hashedPassword;

    await bcrypt
      .genSalt(10)
      .then((salt) => {
        return bcrypt.hash(this.password, salt);
      })
      .then((hash) => {
        hashedPassword = hash;
      })
      .catch((err) => console.error(err.message));
    this.password = hashedPassword;
    next();
  }
});

UserSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing");

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password", error.message);
  }
};

export default mongoose.model("UserModel", UserSchema);
