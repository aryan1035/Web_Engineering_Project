import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Patient from './Patient.js';
import Doctor from './Doctor.js';
import Appointment from './Appointment.js';

const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'patients', key: 'id' },
      onDelete: 'CASCADE',
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'doctors', key: 'id' },
      onDelete: 'CASCADE',
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'appointments', key: 'id' },
      onDelete: 'SET NULL',
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    review: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'ratings',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['doctor_id'] },
      { fields: ['patient_id'] },
    ],
  }
);

Patient.hasMany(Rating, { foreignKey: 'patientId' });
Rating.belongsTo(Patient, { foreignKey: 'patientId' });
Doctor.hasMany(Rating, { foreignKey: 'doctorId' });
Rating.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.hasOne(Rating, { foreignKey: 'appointmentId' });
Rating.belongsTo(Appointment, { foreignKey: 'appointmentId' });

export default Rating;
