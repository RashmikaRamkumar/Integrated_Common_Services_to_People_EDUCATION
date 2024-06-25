import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: {
      validator: function(value) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid Email!",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false,
  },
  gender: {
    type: String,
    required: [true, "Please select your Gender!"],
    enum: ["Male", "Female", "Other"],
  },
  address: {
    type: String,
    required: [true, "Please enter your Address!"],
  },
  age: {
    type: Number,
    required: [true, "Please enter your Age!"],
    min: [21, "Age must be at least 21!"],
  },
  institutionType: {
    type: String,
    required: [true, "Please select an institution type!"],
    enum: ["School", "College"],
  },
  description: {
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters!"],
  },
  institutionDetails: {
    name: {
      type: String,
      required: function() {
        return this.institutionType === "School" || this.institutionType === "College";
      },
    },
    contactNumber: {
      type: String,
      required: function() {
        return this.institutionType === "School" || this.institutionType === "College";
      },
      
      validate: {
        validator: function(value) {
          return /^[6-9]\d{9}$/.test(value);
        },
        message: "Contact number must be exactly 10 digits long and contain only digits!",
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        }
        
      },
    ],
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Custom validator to ensure at least 5 images are uploaded
institutionSchema.path('institutionDetails.images').validate(function(value) {
  return value.length >= 5;
}, 'An institution must have at least 5 images.');

// Pre-save hook to hash the password before saving
institutionSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
institutionSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
institutionSchema.methods.getJWTToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const Institution = mongoose.model("Institution", institutionSchema);
export default Institution;