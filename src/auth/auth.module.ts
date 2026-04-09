import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
    imports:[
     TypeOrmModule.forFeature([User]),

        JwtModule.registerAsync({
            inject:[ConfigService], 
            useFactory:(configService:ConfigService)=>{
                return ({
                    global:true ,
                    secret:configService.get("SECRET_KEY"),
                    signOptions:{expiresIn:configService.get("EXPIRE_IN")}
                })
            }
        })
    ],
    providers:[AuthService ,JwtStrategy] ,
    controllers:[AuthController]
})
export class AuthModule {
  
}