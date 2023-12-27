// EduFun/frontend-angular/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    isLoggedIn$: BehaviorSubject<boolean>; // Change to BehaviorSubject
    userEmail$: BehaviorSubject<string | null>; // Change to BehaviorSubject

    constructor(private authService: AuthService) {
        this.isLoggedIn$ = new BehaviorSubject<boolean>(false); // Initialize with a default value
        this.userEmail$ = new BehaviorSubject<string | null>(null); // Initialize with a default value
    }

    ngOnInit(): void {
        this.checkLoginStatus();
    }

    checkLoginStatus(): void {
        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        this.isLoggedIn$.next(!!token);
        this.userEmail$.next(userEmail);
    }

    logout(): void {
        this.authService.logout();
        this.isLoggedIn$.next(false);
        this.userEmail$.next(null);
        // Handle redirection and page refresh if necessary
    }
}


