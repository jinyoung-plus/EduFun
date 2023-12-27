<<<<<<< HEAD
// EduFun/frontend-angular/src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from './card.model'; // 'Card' 인터페이스 임포트
=======
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
>>>>>>> 2bef0d337ba1be9af7f9a79a70dd3cab85f37d25

@Injectable({
  providedIn: 'root'
})
export class ApiService {
<<<<<<< HEAD
  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  calculateSRS(performanceRating: number, currentInterval: number, easinessFactor: number): Observable<any> {
    const url = `${this.BASE_URL}/api/calculate`; // URL을 '/api/calculate'로 수정
    const body = { performanceRating, currentInterval, easinessFactor };

    return this.http.post(url, body);
  }

  // User Authentication
  signup(email: string, password: string) {
    return this.http.post(`${this.BASE_URL}/signup`, { email, password });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.BASE_URL}/login`, { email, password });
  }

 //덱생성 메소드 추가
  createDeck(deckName: string) {
    const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post('/api/decks', { name: deckName }, { headers });
  }

  // 사용자의 덱 목록을 가져오는 메소드
  getDecks(): Observable<any[]> {
    return this.http.get<any[]>('/api/decks', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}` // 사용자 토큰을 헤더에 추가합니다.
      })
    });
  }

  // Method to delete a deck
  deleteDeck(deckId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.BASE_URL}/decks/${deckId}`, { headers });
  }
  private getToken(): string {
    return localStorage.getItem('authToken') || ''; // 로컬 스토리지에서 토큰을 가져옵니다.
  }

  // Token을 포함하는 HttpHeaders 객체를 생성하는 메소드
  private getHeaders() {
    const token = localStorage.getItem('userToken'); // Token을 로컬 스토리지 또는 적절한 장소에서 가져옴
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDeckById(deckId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.BASE_URL}/decks/${deckId}`, { headers });
  }

  updateDeck(deckId: number, deckData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Make sure to send the full deckData object if the API expects an object
    return this.http.put<any>(`${this.BASE_URL}/decks/${deckId}`, deckData, { headers });
  }

  getDeckCards(deckId: number): Observable<Card[]> {
    // API 엔드포인트로부터 특정 덱의 카드를 불러오는 로직
    return this.http.get<Card[]>(`/api/decks/${deckId}/cards`);
  }

  updateCard(cardId: number, cardData: any): Observable<any> {
    // API 엔드포인트를 사용하여 카드 정보를 업데이트하는 로직
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}` // 여기에 인증 토큰을 추가
    });
    return this.http.put(`${this.BASE_URL}/flashcards/${cardId}`, cardData, { headers });
  }

  // Flashcards
  getFlashcardsForDeck(token: string, deckId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.BASE_URL}/decks/${deckId}/flashcards`, { headers });
  }


  getFlashcards(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.BASE_URL}/flashcards`, { headers });
  }

  addFlashcard(deckId: number, front: string, back: string): Observable<any> {
    // Assuming you're using token-based authentication and storing the token in local storage
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.BASE_URL}/flashcards`, { deckId, front, back }, { headers });
  }

  updateFlashcard(token: string, flashcardId: number, front: string, back: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.BASE_URL}/flashcards/${flashcardId}`, { front, back }, { headers });
  }

  deleteFlashcard(token: string, flashcardId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.BASE_URL}/flashcards/${flashcardId}`, { headers });
  }

  // Study Sessions
  createStudySession(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.BASE_URL}/study-sessions`, {}, { headers });
  }

  endStudySession(token: string, sessionId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.BASE_URL}/study-sessions/${sessionId}`, {}, { headers });
  }

  // Reviews
  createReview(token: string, flashcardId: number, performanceRating: number, studySessionId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.BASE_URL}/reviews`, {
      flashcard_id: flashcardId,
      performance_rating: performanceRating,
      study_session_id: studySessionId
    }, { headers });
  }

  // ... other API methods
=======
  private apiUrl = 'http://localhost:3000/add'; // 백엔드 API URL로 대체

  constructor(private http: HttpClient) { }

  saveWord(wordData: any): Observable<any> {
    // 백엔드 서버로 데이터 전송
    return this.http.post(`${this.apiUrl}/saveWord`, wordData);
  }
>>>>>>> 2bef0d337ba1be9af7f9a79a70dd3cab85f37d25
}
