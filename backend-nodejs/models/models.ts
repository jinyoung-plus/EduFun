// models/models.ts 파일
import { Sequelize, DataTypes } from 'sequelize';

export const sequelize = new Sequelize('postgres://funedu:1234@localhost:5432/funedudb');

export interface UserAttributes {
    id?: number; // id 속성을 선택적으로 만듭니다.
    email: string;
    password: string;
    // ... 기타 속성들 ...
}

export const User = sequelize.define<UserAttributes>('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // ... 기타 속성 정의 ...
}, {
    timestamps: false
});

export { sequelize, User };
