import { Controller, Get, Path, Route } from "tsoa";
import { User } from "@models/user";
import { UsersService } from "@services/users";

@Route("users")
export class UsersController extends Controller {

  @Get("/id/{userId}")
  public async getUserByID(
    @Path() userId: number,
  ): Promise<User> {
    return new UsersService().getByID(userId);
  }
  
  @Get("/name/{userName}")
  public async getUserByName(
    @Path() userName: string,
  ): Promise<User> {
    return new UsersService().getByName(userName);
  }
  
  @Get("")
  public async getAllUsers(): Promise<User[]> {
    return new UsersService().getAllUsers();
  }
  
}
