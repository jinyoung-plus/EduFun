// In deck-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-deck-edit',
    templateUrl: './deck-edit.component.html',
    styleUrls: ['./deck-edit.component.css']
})
export class DeckEditComponent implements OnInit {
    deck: any = {};
    deckId: number = 0; // Declare the property to store deckId
    deckName: string = ''; // Declare the property to store deckName

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute, // Inject ActivatedRoute
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.deckId = +params['deckId'];
            if (!isNaN(this.deckId)) {
                this.getDeckDetails();
            }
        });
    }

    getDeckDetails(): void {
        this.apiService.getDeckById(this.deckId).subscribe(
            data => {
                this.deck = data;
            },
            error => {
                console.error('Error fetching deck details', error);
            }
        );
    }

    saveChanges(): void {
        this.apiService.updateDeck(this.deckId, this.deck).subscribe({
            next: () => {
                alert('Deck updated successfully');
                this.router.navigate(['/deck-list']);
            },
            error: (err) => {
                alert('Failed to update deck');
                console.error(err);
            }
        });
    }
}


