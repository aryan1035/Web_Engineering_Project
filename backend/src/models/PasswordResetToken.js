import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import crypto from 'crypto';
import User from './User.js';

const PasswordResetToken = sequelize.define(
  'PasswordResetToken',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'password_reset_tokens',
    timestamps: true,
    underscored: true,
  }
);

User.hasMany(PasswordResetToken, { foreignKey: 'userId' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId' });

PasswordResetToken.generateToken = function () {
  return crypto.randomBytes(32).toString('hex');
};

export default PasswordResetToken;
