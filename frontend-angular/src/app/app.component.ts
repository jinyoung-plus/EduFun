// EduFun/frontend-angular/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
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

    constructor(private authService: AuthService) {
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
        this.authService.logout();
       // this.isLoggedIn$.next(false);
       // this.userEmail$.next(null);
        // Handle redirection and page refresh if necessary
    }
}


