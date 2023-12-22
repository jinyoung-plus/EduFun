// 2signup.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-2signup',
  templateUrl: './2signup.component.html',
  styleUrls: ['./2signup.component.css']
})
export class SignupComponent {
  signupData = { email: '', password: '' };

  onSignup() {
    // Here, you can add the logic to validate the data and send it to the database.
    // For demonstration purposes, logging the signup data to the console.
    console.log('Signup data:', this.signupData);

    // In a real application, use a service to send the signup data to the backend.
    // Example:
    // this.authService.signup(this.signupData).subscribe(response => {
    //   console.log('Signup response:', response);
    // });
  }
}
