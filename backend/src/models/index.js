import sequelize from '../config/database.js';
import User from './User.js';
import Doctor from './Doctor.js';
import Patient from './Patient.js';
import './PasswordResetToken.js'; // registers model and User association

const db = {
  sequelize,
  User,
  Doctor,
  Patient,
};

export default db;
