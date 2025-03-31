import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Hash the password before saving the user
  public async setPassword(password: string) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }
  
  // Add a password comparison method for login
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export function initUser(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Add unique constraint to prevent duplicate usernames
      },
      password: {
        type: DataTypes.STRING(128), // Specify length to ensure it can hold bcrypt hashes
        allowNull: false,
      },
    },
    {
      tableName: 'users', // Keep lowercase table name
      sequelize,
      modelName: 'User', // This is for JS/TS only, doesn't affect table name
      hooks: {
        // Only set password if it has changed
        beforeCreate: async (user: User) => {
          await user.setPassword(user.password);
        },
        beforeUpdate: async (user: User) => {
          // Only rehash if password field was updated
          if (user.changed('password')) {
            await user.setPassword(user.password);
          }
        },
      }
    }
  );

  return User;
}