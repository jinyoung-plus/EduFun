// reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit  {
  email: string = ''; // Add this line to define the email property
  resetData = {
    email: '',
    newPassword: ''
  };

  constructor(
      private apiService: ApiService,
      private route: ActivatedRoute, // Inject ActivatedRoute
      private router: Router
  ) {  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resetData.email = params['email'] || ''; // Update resetData.email instead of this.email
    });
  }

  resetPassword(): void {
    this.apiService.resetUserPassword(this.resetData.email, this.resetData.newPassword).subscribe({
      next: () => {
        alert('Password reset successfully.');
        this.router.navigate(['/login']);
      },
      error: () => alert('Failed to reset password.')
    });
  }
}

