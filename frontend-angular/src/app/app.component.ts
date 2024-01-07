// EduFun/frontend-angular/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highcharts);

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    isLoggedIn$: Observable<boolean>;
    userEmail$: Observable<string | null>;

    constructor(
      private authService: AuthService,
      private apiService: ApiService
      ) {
        // Initialize the Observables in the constructor
        this.isLoggedIn$ = this.authService.isLoggedIn;
        this.userEmail$ = this.authService.currentUserEmail;
    }

    ngOnInit(): void {
       // this.checkLoginStatus();
        this.isLoggedIn$ = this.authService.isLoggedIn;
        this.userEmail$ = this.authService.currentUserEmail;
    }

    checkLoginStatus(): void {
        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        //this.isLoggedIn$.next(!!token);
        //this.userEmail$.next(userEmail);
    }

  logout(): void {
    // Check if there is an active study session ID
    const activeStudySessionId = localStorage.getItem('activeStudySessionId');
    if (activeStudySessionId) {
      // Call the API to end the study session
      const token = this.getToken(); // Make sure you have a method to retrieve the auth token
      if (token) {
        this.apiService.endStudySession(token, parseInt(activeStudySessionId)).subscribe(
          (response) => {
            console.log('Study session ended successfully');
          },
          (error) => {
            console.error('Failed to end study session', error);
          }
        );
      }
    }
    // Proceed with the logout process
    this.authService.logout();
    localStorage.removeItem('activeStudySessionId'); // Remove the session ID from localStorage
    // ... any additional cleanup ...
  }

// Utility method to retrieve the current user's token
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

}


