import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from './sequelize';

class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {
    declare id: string;
    declare channelId: string;
}

Guild.init(
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        channelId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelize,
        modelName: 'Guild',
        timestamps: false,
    }
);

Guild.sync();

export default Guild;
