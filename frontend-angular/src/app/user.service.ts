// src/app/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000'; // Node.js 서버 URL

  constructor(private http: HttpClient) {}

  saveUserName(userName: string) {
    return this.http.post(`${this.baseUrl}/users`, { username: userName });
  }

  // 추가: 사용자 데이터를 가져오는 메소드
  getUserData(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

  // 추가: 모든 사용자 데이터를 가져오는 메소드
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  // 추가: 사용자 데이터를 업데이트하는 메소드
  updateUserData(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}`, userData);
  }

  // 추가: 사용자를 삭제하는 메소드
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }
}
