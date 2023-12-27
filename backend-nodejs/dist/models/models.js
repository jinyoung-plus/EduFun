"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('postgres://funedu:1234@localhost:5432/funedudb');
exports.sequelize = sequelize;
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        unique: true,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'users',
    timestamps: false
});
//# sourceMappingURL=models.js.map