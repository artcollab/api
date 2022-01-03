import { Schema, model } from 'mongoose';
import { User } from '@models/user';

// export interface IUser extends Document {
//     email: string;
//     name: string;
//     phoneNumbers: [string];
// };

const UserSchema = new Schema<User>({

    // TODO - base these parameters off User model
    id: {type: Number, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    name: {type: String, required: true},
    phoneNumbers: [{type: String, required: true}]

});

const UserModel =  model<User>('users', UserSchema);

export default UserModel;
