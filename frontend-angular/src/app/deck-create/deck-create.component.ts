// deck-create.component.ts
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router'; // Router를 import합니다.

@Component({
    selector: 'app-deck-create',
    templateUrl: './deck-create.component.html',
    styleUrls: ['./deck-create.component.css']
})
export class DeckCreateComponent {
    deckName = '';

    constructor(
        private apiService: ApiService,
        private router: Router // Router를 constructor에 추가합니다.
    ) {}

    createDeck(): void {
        // Check if the deckName is not empty, null, or undefined.
        if (!this.deckName) {
            alert('Please enter a deck name.'); // Show an alert if deckName is falsy.
            return; // Exit the function to prevent further execution.
        }

        // Proceed with deck creation if deckName is truthy.
        this.apiService.createDeck(this.deckName).subscribe({
            next: data => {
                console.log('Deck created successfully', data);
                alert('New deck has been created.'); // Show success message.
                this.router.navigate(['/deck-list']); // Redirect to deck-list page.
            },
            error: error => {
                console.error('Error creating deck', error);
                alert('Failed to create deck.'); // Show failure message.
            }
        });
    }
}
