import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('api/users')
export class AuthController {
   constructor(
    private readonly authService:AuthService 
   ){}

   @Post('/register')
   @ApiOperation({summary:'Register New User'})
   @ApiBody({type:RegisterDto})
   @ApiResponse({status:200,description:"user registered successfully"})
   Register(@Body() body:RegisterDto){
    return this.authService.SignUp(body)
   }

   @Post('/login')
   @ApiOperation({summary:"Login user"})
   @ApiBody({type:LoginDto})
   @ApiResponse({status:200,description:"login successfully"})
   Login(@Body() body:LoginDto){
      return this.authService.SignIn(body)
   }
   

}