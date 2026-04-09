import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createUser(data: CreateUserDto) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async getAllUser() {
    return await this.userRepository.find();
  }

  async getSpecificUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async updateUserData(id: number, data: UpdateUserDto) {
    await this.getSpecificUser(id);
    await this.userRepository.update(id, data);

    return await this.getSpecificUser(id);
  }

  async deleteUser(id: number) {
    await this.getSpecificUser(id);
    await this.userRepository.delete(id);

    return { message: 'user deleted successfully' };
  }

  async forgetPassword(email: string) {
  const user = await this.userRepository.findOne({
    where: { email },
  });

  if (!user) {
    return { message: "user not found" };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetToken = hashedToken;
  user.resetTokenExpired = new Date(Date.now() + 10 * 60 * 1000);

  await this.userRepository.save(user); 

  const link = `http://localhost:3000/reset-password/${resetToken}`;

  await this.mailService.sendEmail(
    user.email,
    'Reset Password',
    `Click here: ${link}`,
  );
  

  return { message: 'Email sent successfully' };
}

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
    const user = await this.userRepository.findOne({
      where: { resetToken:hashedToken  }
    });
    if (!user) {
      throw new BadRequestException('Invalid token')
    }

    if (!user.resetTokenExpired || user.resetTokenExpired < new Date()) {
  throw new BadRequestException('Token expired');
}

    user.password = await bcrypt.hash(newPassword, 10)
    user.resetToken = null
    user.resetTokenExpired = null
    await this.userRepository.save(user)
     return { message: "Password updated" }

  }
}
