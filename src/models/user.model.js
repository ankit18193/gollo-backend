import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      
      required: function() {
        return this.provider === 'local';
      }
    },

    
    provider: {
      type: String,
      enum: ["local", "google", "microsoft", "github", "linkedin"],
      default: "local",
    },

    
    providerId: {
      type: String,
      unique: true,
      sparse: true, 
    },
    
    avatar: {
      type: String, 
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;