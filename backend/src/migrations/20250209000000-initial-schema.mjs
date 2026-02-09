import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('patient', 'doctor', 'admin'),
      allowNull: false,
      defaultValue: 'patient',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await queryInterface.createTable('doctors', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    bmdc_registration_number: { type: DataTypes.STRING(50), allowNull: true },
    department: { type: DataTypes.STRING(100), allowNull: true },
    experience: { type: DataTypes.INTEGER, allowNull: true },
    education: { type: DataTypes.TEXT, allowNull: true },
    certifications: { type: DataTypes.TEXT, allowNull: true },
    hospital: { type: DataTypes.STRING(200), allowNull: true },
    location: { type: DataTypes.STRING(300), allowNull: true },
    consultation_fee: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    profile_image: { type: DataTypes.STRING(500), allowNull: true },
    chamber_times: { type: DataTypes.JSON, allowNull: true },
    degrees: { type: DataTypes.JSON, allowNull: true },
    awards: { type: DataTypes.JSON, allowNull: true },
    languages: { type: DataTypes.JSON, allowNull: true },
    services: { type: DataTypes.JSON, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await queryInterface.createTable('patients', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    blood_type: { type: DataTypes.STRING(10), allowNull: true },
    allergies: { type: DataTypes.TEXT, allowNull: true },
    emergency_contact: { type: DataTypes.STRING(100), allowNull: true },
    emergency_phone: { type: DataTypes.STRING(20), allowNull: true },
    insurance_provider: { type: DataTypes.STRING(100), allowNull: true },
    insurance_number: { type: DataTypes.STRING(50), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await queryInterface.createTable('password_reset_tokens', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
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
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('password_reset_tokens');
  await queryInterface.dropTable('patients');
  await queryInterface.dropTable('doctors');
  await queryInterface.dropTable('users');
}
