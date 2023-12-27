// frontend-angular/src/app/card.model.ts

// In card.model.ts

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
    currentInterval: number; // Assuming this is a number
    easinessFactor: number; // Assuming this is a number
}
