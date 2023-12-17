import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private contactsUrl = 'http://localhost:3000/contacts';
  private reservationsUrl = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) { }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.contactsUrl);
  }

  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.reservationsUrl);
  }
}
