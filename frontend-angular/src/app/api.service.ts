
// EduFun/frontend-angular/src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, ReviewCard } from './card.model'; // 'Card' 인터페이스 임포트


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  calculateSRS(performanceRating: number, currentInterval: number, easinessFactor: number, repetitions: number): Observable<any> {
    const url = `${this.BASE_URL}/api/calculate`; // Ensure this URL matches your actual API endpoint
    const body = { performanceRating, currentInterval, easinessFactor, repetitions };

    return this.http.post(url, body);
  }

  // User Authentication
  signup(email: string, password: string) {
    return this.http.post(`${this.BASE_URL}/signup`, { email, password });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.BASE_URL}/login`, { email, password });
  }

  resetUserPassword(email: string, newPassword: string) {
    return this.http.post(`${this.BASE_URL}/reset-password`, { email, newPassword });
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


  // Flashcards
  getFlashcardsForDeck(token: string, deckId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.BASE_URL}/decks/${deckId}/flashcards`, { headers });
  }

  // Method to get flashcards for a deck sorted by SRS algorithm
  getFlashcardsForDeckSRS(token: string, deckId: number): Observable<Card[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // This endpoint should return cards sorted based on the SRS algorithm criteria
    // Adjust the endpoint as needed based on your actual API implementation
    return this.http.get<Card[]>(`${this.BASE_URL}/api/decks/${deckId}/flashcards/srs`, { headers });
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


  addFlashcardsBulk(deckId: number, flashcards: { front: string, back: string }[]): Observable<any> {
    // 토큰을 가져옵니다. 인증이 필요하다면 이 부분을 사용합니다.
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // POST 요청을 서버에 보냅니다. 여기서는 '/flashcards/bulk' 엔드포인트를 사용했습니다.
    // 실제 엔드포인트는 백엔드 구현에 따라 달라질 수 있습니다.
    return this.http.post(`${this.BASE_URL}/flashcards/bulk`, { deckId, flashcards }, { headers });
  }

  saveSession(token: string, reviewedCards: ReviewCard[]) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Adjust the URL and body according to your backend's requirements
    return this.http.post(`${this.BASE_URL}/save-session`, { reviewedCards }, { headers });
  }

  // 학습 세션을 시작하는 메서드
  // Method to start a new study session
  startStudySession(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.BASE_URL}/study-sessions`, {}, { headers });
  }

// Method to end a study session
  endStudySession(token: string, sessionId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // The request is changed to PUT and the sessionId is included in the URL path
    return this.http.put(`${this.BASE_URL}/study-sessions/${sessionId}`, {}, { headers });
  }

  // Method to send the review data to the backend for processing
  processReview(token: string, reviewData: { flashcardId: number; studySessionId: number; performanceRating: number }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.BASE_URL}/reviews/process`, reviewData, { headers });
  }
  // 리뷰 정보를 저장하는 메서드
  createReview(token: string, reviewData: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.BASE_URL}/reviews`, reviewData, { headers });
  }

  // 카드 정보를 업데이트하는 메서드
  updateCard(token: string, cardId: number, cardData: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.BASE_URL}/flashcards/${cardId}`, cardData, { headers });
  }

  getWeeklyStudyData(startDate: Date, endDate: Date): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Format the dates as YYYY-MM-DD
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Add the startDate and endDate as query parameters
    const params = new HttpParams()
        .set('startDate', formattedStartDate)
        .set('endDate', formattedEndDate);

    return this.http.get(`${this.BASE_URL}/weekly-study-data`, { headers, params });
  }
}
