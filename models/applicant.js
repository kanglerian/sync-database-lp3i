'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Applicant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Applicant.init({
    identity: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    pmb: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    gender: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    place_of_birth: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    social_media: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
    },
    education: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    school: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    major: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    class: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    achievement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kip: {
      type: DataTypes.STRING(16),
      unique: true,
      allowNull: true,
    },
    nisn: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: true,
    },
    nik: {
      type: DataTypes.STRING(16),
      unique: true,
      allowNull: true,
    },
    schoolarship: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    relation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    identity_user: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    program: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    program_second: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isread: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    come: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_applicant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_daftar: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_register: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    known: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    planning: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    other_campus: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    income_parent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    followup_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    programtype_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source_daftar_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Applicant',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'applicants'
  });
  return Applicant;
};