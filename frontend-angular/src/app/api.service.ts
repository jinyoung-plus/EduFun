// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/add'; // 백엔드 API URL로 대체

  constructor(private http: HttpClient) { }

  saveWord(wordData: any): Observable<any> {
    // 백엔드 서버로 데이터 전송
    return this.http.post(`${this.apiUrl}/saveWord`, wordData);
  }
}
