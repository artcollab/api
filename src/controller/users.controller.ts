import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Response,
  SuccessResponse,
  Route,
} from "tsoa";
import { User } from "@models/user";
import { UserCreationParams, UsersService } from "@services/users";

// These error types will be reused so they need to be in another file
export interface ValidateErrorJSON {
  message: "Validation failed";
  details: { [name: string]: unknown };
}

export interface NotUniqueErrorJSON {
  message: "Not Unique";
  details: { [name: string]: unknown };
}

export class ApiError extends Error {
  private statusCode: number;

  constructor(name: string, statusCode: number, message?: string) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getName(): string {
    return this.name;
  }

  public getMessage(): string {
    return this.message;
  }
}

@Route("users")
export class UsersController extends Controller {
  /**
   * Get a user by ID
   *
   * @param userId The ID of the user you are searching for
   * @returns The user object with matching ID,
   * @statusCodes 200 OK, 400 Validation Failed, 404 Not Found, 500 Server Error
   */
  @Get("/id/{userId}")
  @Response<ValidateErrorJSON>(400, "Validation Failed")
  @SuccessResponse("200", "OK")
  public async getUserByID(@Path() userId: number): Promise<User> {
    return new UsersService().getByID(userId);
  }

  /**
   * Get a user by name
   *
   * @param userName The name of the user you are searching for
   * @returns The user object with matching ID,
   * @statusCodes 200 OK, 400 Validation Failed, 404 Not Found, 500 Server Error
   */
  @Get("/name/{userName}")
  @Response<ValidateErrorJSON>(400, "Validation Failed")
  @SuccessResponse("200", "OK")
  public async getUserByName(@Path() userName: string): Promise<User> {
    return new UsersService().getByName(userName);
  }

  /**
   * Get all users
   *
   * @returns An array of  all users in the database
   * @statusCodes 200 OK, 500 Server Error
   */
  @Get("")
  @SuccessResponse("200", "OK")
  public async getAllUsers(): Promise<User[]> {
    return new UsersService().getAllUsers();
  }

  /**
   * Create a user
   *
   * @param requestBody a UserCreationParams object representing the user to be added
   * @statusCodes 201 Created, 400 Validation Error, 409 Not Unique, 500 Server Error
   */

  // It doesn't appear to be using the 201 we specify here
  @SuccessResponse(201, "OK")
  @Post("")
  @Response<ApiError>(400, "Validation Failed")
  @Response<ApiError>(409, "Not Unique")
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<void> {
    const rep = await new UsersService().create(requestBody);
    if (rep instanceof Error) {
      throw rep;
    }
    return;
  }
}
