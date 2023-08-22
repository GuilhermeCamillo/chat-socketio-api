import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../app/users/users.entity';
import { UsersService } from '../app/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user) {
    const payload = { sub: user.id, email: user.email };
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: this.jwtService.sign(payload),
    };
  }

  async signup(data) {
    return this.userService.store(data);
  }

  async validateUser(email: string, password: string) {
    let user: UsersEntity;
    try {
      user = await this.userService.findOneOrFail({ where: { email } });
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
