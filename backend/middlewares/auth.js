<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import { Student, Teacher, Institution, Center, Admin } from '../models/index.js';
import { catchAsyncErrors } from './catchAsyncError.js';
import ErrorHandler from './error.js';
=======
// auth.js
import { Student } from "../models/studentSchema.js";
import { Teacher } from "../models/teacherSchema.js";
import { Institution } from "../models/institutionSchema.js";
import { Center } from "../models/centerSchema.js";
import { Admin } from "../models/adminSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
>>>>>>> b59c11d5d3683416baec6a4fe18daa42ee48053d

// Middleware to check if user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Please login to access this resource', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Decoded JWT:', decoded);

    let user;
    switch (decoded.type) {
      case 'student':
        user = await Student.findById(decoded.id);
        break;
      case 'teacher':
        user = await Teacher.findById(decoded.id);
        break;
      case 'institution':
        user = await Institution.findById(decoded.id);
        break;
      case 'center':
        user = await Center.findById(decoded.id);
        break;
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      default:
        throw new ErrorHandler('Invalid user type', 401);
    }

    if (!user) {
      return next(new ErrorHandler('User not found based on token', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler('User not authorized', 401));
  }
});

<<<<<<< HEAD

// Middleware to check if the user is a teacher
export const isTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'You are not logged in.' });
  }

  if (req.user.type === 'teacher') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied. Only teachers are allowed.' });
  }
};

// Middleware to check if the user is an institution
export const isInstitution = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'You are not logged in.' });
  }

  if (req.user.type === 'institution') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied. Only institutions are allowed.' });
  }
};

// Middleware to check if the user is a center
export const isCenter = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'You are not logged in.' });
  }

  if (req.user.type === 'center') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied. Only centers are allowed.' });
  }
};
// Middleware to check if the user is a student
export const isStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'You are not logged in.' });
  }

  if (req.user.type === 'student') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied. Only students are allowed.' });
  }
};


// Middleware to check if the user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'You are not logged in.' });
  }

  if (req.user.type === 'admin') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied. Only students are allowed.' });
  }
=======
// Middleware to authorize roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
>>>>>>> b59c11d5d3683416baec6a4fe18daa42ee48053d
};
