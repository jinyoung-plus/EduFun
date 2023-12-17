import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  contacts: any[] = [];
  reservations: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadContacts();
    this.loadReservations();
  }

  loadContacts(): void {
    this.adminService.getContacts().subscribe(
      data => this.contacts = data,
      error => console.error('Error fetching contacts', error)
    );
  }

  loadReservations(): void {
    this.adminService.getReservations().subscribe(
      data => this.reservations = data,
      error => console.error('Error fetching reservations', error)
    );
  }
}
