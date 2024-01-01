// frontend-angular/src/app/card.model.ts

export interface Card {
    id: number;
    deckId: number;
    front: string;
    back: string;
    // Add other properties that are common to all cards
}

// Extend the Card interface to include properties for the review session
export interface ReviewCard extends Card {
    review: boolean;
    repetitions: number; // 복습 횟수
    currentInterval: number; // Assuming this is a number
    easinessFactor: number; // Assuming this is a number
}

export interface Deck {
    id: number;
    name: string;
    description?: string; // The '?' denotes that the description is optional
    cardcount?: number;  // You might want to keep track of the number of cards
    // You can add other relevant properties here
}
