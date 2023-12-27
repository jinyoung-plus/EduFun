// EduFun/frontend-angular/src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 //private loggedIn = new BehaviorSubject<boolean>(false);
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userEmail = new BehaviorSubject<string>(localStorage.getItem('userEmail') || '');

  constructor() { }

  get isAuthenticated() {
    return this.loggedIn.asObservable();
  }

   loginStatusChange(status: boolean) {
    this.loggedIn.next(status);
  }


  get isLoggedIn() {
    // Update the loggedIn BehaviorSubject based on the presence of the token
    this.loggedIn.next(this.hasToken());
    return this.loggedIn.asObservable();
  }

  get currentUserEmail() {
    return this.userEmail.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
  }

  setUserEmail(email: string): void {
    localStorage.setItem('userEmail', email);
    this.userEmail.next(email);
  }

  clearUser(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    this.loggedIn.next(false);
    this.userEmail.next('');
  }

  logout(): void {
    // Clear user information from the local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    // Update the loggedIn status and clear userEmail
    this.loggedIn.next(false);
    this.userEmail.next('');
  }
}



