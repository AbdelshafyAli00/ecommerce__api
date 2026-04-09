import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import bcrypt from "bcrypt"
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { Role } from "src/users/enums/role.enum";

@Injectable()
export class AuthService {
   constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly jwtService:JwtService
   ){}

   async SignUp(registerDto:RegisterDto){
    const {name,email,password,role} = registerDto
    const user = await this.userRepository.findOne({where:{email}}) 
    if(user) {
        throw new BadRequestException("user already exist")
    }
    const salt = await bcrypt.genSalt(10) 
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = await this.userRepository.create({
        name ,
        email ,
        password:hashedPassword ,
        role:role??Role.User

    })

    await this.userRepository.save(newUser) 
    return newUser 
   }

   async SignIn (loginDto:LoginDto){
    const {email,password} = loginDto 

    const user = await this.userRepository.findOne({where:{email}})
    if(!user) {
        throw new NotFoundException("user not found with thid email")
    }

    const isMatchPassword =  await bcrypt.compare(password,user.password)
    if(!isMatchPassword){
        throw new BadRequestException("password is in correct")
    }

    const payload = {id:user.id ,role:user.role}
    const token = await this.jwtService.signAsync(payload)
    return {token}  




   }

}