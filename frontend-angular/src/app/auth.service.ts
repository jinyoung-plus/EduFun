import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminCredentials = { username: 'admin', password: 'admin123' };

  login(username: string, password: string): boolean {
    return username === this.adminCredentials.username && password === this.adminCredentials.password;
  }
}
