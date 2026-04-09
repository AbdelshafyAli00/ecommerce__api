import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { resetPasswordDto } from './dtos/reset-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({summary:"Create user"})
  @ApiBody({type:CreateUserDto})
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  createNewUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Get()
  @ApiOperation({summary:"Get all users"})
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  getAll(){
    return this.usersService.getAllUser()
  }

  @Get(':id')
  @ApiOperation({summary:"Get user by Id"})
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  getUser(@Param('id',ParseIntPipe) id:number){
    return this.usersService.getSpecificUser(id)
  }

  @Patch(':id')
  @ApiOperation({summary:"Update user"})
  @ApiParam({name:'id',example:1})
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @ApiBody({type:UpdateUserDto})
  UpdateUser(@Param('id',ParseIntPipe) id:number , @Body() data:UpdateUserDto){
    return this.usersService.updateUserData(id,data)
  }

  @Delete(':id')
  @ApiOperation({summary:"Delete user"})
  @ApiParam({name:'id' ,example:1})
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  deleteUser(@Param('id',ParseIntPipe) id:number){
    return this.usersService.deleteUser(id)
  }

  @Post('forget-password')
  @ApiOperation({summary:"Forget password"})
  @ApiBody({type:ForgetPasswordDto})
  forgetPassword(@Body() data:ForgetPasswordDto){
    return this.usersService.forgetPassword(data.email)
  }

  @Post('reset-password')
  @ApiOperation({summary:"Reset password"})
  @ApiBody({type:resetPasswordDto})
  resetPassword(@Body() data:resetPasswordDto){
    return this.usersService.resetPassword(data.token,data.newPassword)

  }
}
