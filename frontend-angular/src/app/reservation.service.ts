import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {}

    createReservation(reservationData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/reservations`, reservationData);
    }

    // Additional methods related to reservation could go here
}
