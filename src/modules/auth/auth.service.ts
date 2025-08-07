import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Dummy validate method for testing
  async validateUser(username: string, pass: string): Promise<any> {
    return { username };
  }
}
