import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-make-reservation',
  templateUrl: './make-reservation.component.html',
  styleUrls: ['./make-reservation.component.css']
})
export class MakeReservationComponent implements OnInit {
  reservationForm!: FormGroup;
  successMessage: string = ''; // 예약 성공 메시지를 위한 변수

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.reservationForm = this.fb.group({
      venue: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      guests: ['', [Validators.required, Validators.min(1)]],
      specialRequests: ['']
    });
  }

  submitReservation(): void {
    if (this.reservationForm.valid) {
      this.reservationService.createReservation(this.reservationForm.value)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Your reservation has been submitted successfully! Thank you!!'; // 성공 메시지 설정
            this.initializeForm(); // 폼을 초기화합니다.
          },
          error: (error) => {
            console.error('Error creating reservation:', error);
          }
        });
    } else {
      console.error('The reservation form is not valid');
    }
  }
}
