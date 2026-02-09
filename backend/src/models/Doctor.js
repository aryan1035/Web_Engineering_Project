import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Doctor = sequelize.define(
  'Doctor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    bmdcRegistrationNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Years of experience',
    },
  },
  {
    tableName: 'doctors',
    timestamps: true,
    underscored: true,
  }
);

User.hasOne(Doctor, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

export default Doctor;
