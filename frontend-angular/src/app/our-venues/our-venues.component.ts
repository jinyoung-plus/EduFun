import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-our-venues',
  templateUrl: './our-venues.component.html',
  styleUrls: ['./our-venues.component.css']
})
export class OurVenuesComponent implements OnInit {
  images = [
    '/assets/grandballroom1.png',
    '/assets/grandballroom2.png',
    '/assets/middleroom1.png',
    '/assets/middleroom2.png',
    '/assets/smallroom1.png',
    '/assets/smallroom2.png',
  ];
  descriptions = [
    'This is room 1 with a luxurious atmosphere.',
    'This is Room 2, which has a stylish and cozy atmosphere.',
    'This is Room 3, which has a neat and tidy atmosphere.',
    'This is room 4 with a warm and friendly atmosphere.',
    'This is Room 5 with a lively and cheerful atmosphere.',
    'This is room 6 with a great view.'
  ];
  constructor() { }

  ngOnInit(): void {
  }
}
