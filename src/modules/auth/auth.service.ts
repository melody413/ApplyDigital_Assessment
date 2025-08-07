import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Dummy validate method for testing
  validateUser(username: string, pass: string): Promise<any> {
    return Promise.resolve({ username, pass });
  }
}
