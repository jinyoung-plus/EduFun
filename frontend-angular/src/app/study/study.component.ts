// study.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Deck, Card, ReviewCard } from '../card.model';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css']
})
export class StudyComponent implements OnInit {
  decks: any[] = [];
  selectedDeckId: number | null = null;
  selectedDeck?: Deck; // Declare the selectedDeck property
  currentDeck: any;
  currentCard?: Card | null = null; //ReviewCard | null = null; // To hold the current card
  currentCardIndex: number = 0; // To keep track of the current card's index
  reviewSession: ReviewCard[] = [];
  showAnswerFlag: boolean = false; // To determine whether to show the answer
  reviewMade = false;
  buttonsDisabled = false;
  public userMessage: string = ''; // 사용자 메시지를 위한 속성 추가
  studyDirection: string = 'basic'; // New property for study direction
  cardOrder: string = 'sequential'; // New property for card order
  private currentStudySessionId: number | null = null;

  private getCurrentStudySessionId(): number | null {
    // 현재 학습 세션 ID를 반환합니다.
    // 실제 구현은 앱의 상태 관리 방식에 따라 다를 수 있습니다.
    return this.currentStudySessionId;
  }

  constructor(
      private apiService: ApiService,
      private changeDetector: ChangeDetectorRef // 변경 감지기 추가
  ) {}

  ngOnInit(): void {
    this.getDecks();
  }

  onSelectDeck(): void {
    this.selectedDeck = this.decks.find(deck => deck.id === this.selectedDeckId);
    // Perform additional logic if necessary
  }

  getDecks(): void {
    this.apiService.getDecks().subscribe(
        (decks) => {
          this.decks = decks.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        },
      error => {
        console.error('Error fetching decks', error);
      }
    );
  }
  // Updated startStudy method
  startStudy(): void {
    if (!this.selectedDeckId) {
      alert('Please select a deck to start studying.');
      return;
    }
    const deckId = Number(this.selectedDeckId);
    this.selectedDeck = this.decks.find(deck => deck.id === this.selectedDeckId);

    if (deckId) {
      const token = localStorage.getItem('authToken') || '';
      if (token) {
        this.apiService.getFlashcardsForDeck(token, deckId).subscribe(
          (cards: Card[]) => {
            this.reviewSession = cards.map(card => ({
              ...card, // 기존 카드 속성들을 펼쳐 넣습니다.
              review: false, // 복습 여부를 false로 초기화합니다.
              currentInterval: 0, // 현재 간격을 0으로 초기화합니다.
              easinessFactor: 2.5, // 용이성 계수를 2.5로 초기화합니다.
              repetitions: 0, // 복습 횟수를 0으로 초기화합니다.
            }));

            // Randomize the cards if 'random' is selected
            if (this.cardOrder === 'random') {
              this.shuffleArray(this.reviewSession);
            }

            // Reverse the cards if 'reverse' is selected
            if (this.studyDirection === 'reverse') {
              this.reviewSession.forEach(card => {
                [card.front, card.back] = [card.back, card.front];
              });
            }

            // Set the first card
            this.setFirstCard();
            this.currentStudySessionId = this.createStudySessionId();
          },
          error => console.error('Error fetching flashcards', error)
        );
      } else {
        console.error('No auth token found');
      }
    } else {
      console.error('No deck selected');
    }
  }

  private createStudySessionId(): number {
    // 현재 시간의 타임스탬프를 유니크한 학습 세션 ID로 사용합니다.
    return Date.now();
  }
// Utility method to shuffle an array
  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Method to set the first card of the session
  setFirstCard(): void {
    if (this.reviewSession.length > 0) {
      this.currentCardIndex = 0;
      this.currentCard = this.reviewSession[this.currentCardIndex];
      this.showAnswerFlag = false;
      this.changeDetector.detectChanges(); // Update the view
    }
  }

  showAnswer(): void {
    // Toggle the flag to show the answer
    if (this.currentCard) {
      this.showAnswerFlag = true;
    }
  }

  previousCard(): void {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.currentCard = this.reviewSession[this.currentCardIndex];
      this.showAnswerFlag = false;
      this.reviewMade = false;
      this.buttonsDisabled = false;
      this.userMessage = ''; // 메시지 초기화
    } else {
      // Display message when the user is at the first card
      alert('There is no more card.');
    }
  }

  nextCard(): void {
    if (this.currentCardIndex < this.reviewSession.length - 1) {
      this.currentCardIndex++;
      this.currentCard = this.reviewSession[this.currentCardIndex];
      this.showAnswerFlag = false;
      this.reviewMade = false;
      this.buttonsDisabled = false;
      this.userMessage = ''; // 메시지 초기화
    } else {
      // Display message when the user is at the last card
      alert('There is no more card.');
    }
  }

  // 리뷰카드 메서드
  reviewCard(cardId: number, performanceRating: number): void {
    if (this.buttonsDisabled) {
      // 이미 처리 중인 요청이 있으면 더 이상 진행하지 않음
      return;
    }

    this.buttonsDisabled = true; // 버튼을 비활성화하여 중복 클릭 방지

    // 로컬 스토리지에서 사용자 토큰을 가져옴
    const token: string | null = localStorage.getItem('authToken');

    // 선택된 카드를 찾음
    const card = this.reviewSession.find(card => card.id === cardId);
    if (!card || !token) {
      console.error(`Card with ID: ${cardId} not found in review session or user is not authenticated`);
      this.buttonsDisabled = false; // 버튼을 다시 활성화
      return;
    }

    // 로그를 남기고 SRS 계산을 위한 요청을 보냄
      console.log(`Reviewing card with ID: ${cardId} and performance rating: ${performanceRating}`);
      this.apiService.calculateSRS(performanceRating, card.currentInterval, card.easinessFactor).subscribe(
           response => {
          // SRS 계산 응답을 받고 카드를 업데이트
          console.log('Received SRS calculation response:', response);

          // 현재 진행 중인 학습 세션 ID를 얻어야 함
          const studySessionId = this.getCurrentStudySessionId(); // 현재 학습 세션 ID를 얻는 메소드가 필요함

          // 리뷰 정보를 서버에 전송하여 저장
          this.apiService.createReview(token,{
            flashcardId: cardId,
            studySessionId: studySessionId,
               performanceRating: performanceRating,
               newInterval: response.newInterval,
               newEasinessFactor: response.newEasinessFactor,
               repetitions: card.repetitions
          }).subscribe(
              reviewResponse => {
                console.log('Review recorded successfully', reviewResponse);
                this.buttonsDisabled = false; // 버튼을 다시 활성화
              },
              reviewError => {
                console.error('Failed to record review', reviewError);
                this.buttonsDisabled = false; // 버튼을 다시 활성화
              }
          );
        },
        srsError => {
          console.error('Error calculating SRS', srsError);
          this.buttonsDisabled = false; // 버튼을 다시 활성화
          this.reviewMade = false; // 리뷰 상태를 초기화
        }
    );
  }


  endSession(): void {
    if (this.currentDeck && this.reviewSession.length) {
      const token = localStorage.getItem('authToken') || '';
      const reviewedCards = this.reviewSession.filter(card => card.review);

      if (token && reviewedCards.length) {
        this.apiService.saveSession(token, reviewedCards).subscribe(
            (response: any) => { // Ideally, replace 'any' with a more specific type
              // Handle the response here
              alert('Study session saved.');
            },
            (error: any) => { // Ideally, replace 'any' with a more specific type
              console.error('Failed to save session', error);
            }
        );
      }
    }

    alert('Reset study session.');
    // Reset session state
    this.currentDeck = null;
    this.currentCard = null;
    this.currentCardIndex = 0;
    this.reviewSession = [];
    this.selectedDeckId = null;
  }
}

