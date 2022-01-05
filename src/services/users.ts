import UserModel, { User } from "@models/user";
import { emailRegexp } from '@util/regex';
// import { ValidateError } from "tsoa";

import { ApiError } from "@controller/users.controller";

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

export class UsersService {
  // Get uses based on ID.
  public async getByID(id: number): Promise<User> {
    
    // Need to validate the user given id to prevent spooky stuff

    // Need to do some TypeScript stuff to make this proper
    return await UserModel.findOne({"id": id}).then((data) => {
        
      // Need to do some validation first

      return data as User;

    })
    .catch((error: Error) => {
      throw error;
    });

  }

  public async getByName(name: string): Promise<User> {
    
    // Need to validate the user given username to prevent spooky stuff

    // Need to do some TypeScript stuff to make this proper
    return await UserModel.findOne({"name": name}).then((data) => {
        
      // Need to do some validation first
      
      return data as User;

    })
    .catch((error: Error) => {
      throw error;
    });

  }

  public async getAllUsers(): Promise<User[]> {

    // Need to do some TypeScript stuff to make this proper
    return await UserModel.find().then((data) => {

      return data as User[];

    })
    .catch((error: Error) => {
      throw error;
    });

  }

  public create(userCreationParams: UserCreationParams) {

    // This one works
    if (!emailRegexp.test(userCreationParams.email))
      throw new ApiError("Validation error", 400, "Email is invalid");

    const newUser = new UserModel({
      id: Math.floor(Math.random() * 10000), // Random
      name: userCreationParams.name,
      email: userCreationParams.email,
      phoneNumbers: userCreationParams.phoneNumbers
    });

    UserModel.findOne({"email": newUser.email}).then((data) => {
      
      if (data) {

        // This one doesn't work
        throw new ApiError("Not unique",  409, "Email is already in use");

      } else {

        newUser.save().then(() => {

          return newUser;
    
        })
        .catch((error: Error) => {
          throw error;
        });

      }

    });

    //  This is wrong, we need to return some kind of error
    //  Which is tricky if the function is expecting type User
    return newUser;

  }

}
