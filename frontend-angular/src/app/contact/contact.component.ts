// src/app/contact/contact.component.ts

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact = { name: '', email: '', message: '' };
  submissionMessage: string | null = null;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.contactService.sendContactForm(this.contact).subscribe(
        response => {
          this.submissionMessage = "Thank you! Your message has been sent, and we will respond within 6 hours.";
          form.reset(); // 폼 초기화
        },
        error => {
          this.submissionMessage = "An error occurred. Please try again later.";
        }
      );
    }
  }
}
