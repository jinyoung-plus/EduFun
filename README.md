HEAD

# EduFun

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Screenshots

![Screenshot 1](/screenshots/screenshot1.png)
This page features a screenshot of the main page, allowing users to log in, sign up, or engage in studying. The main page provides access to four categories: study, deck, card, and statistics.

![Screenshot 2](/screenshots/screenshot2.png)
This page serves as the registration window. Upon successful completion of the user's registration, a notification will appear indicating that the registration is complete. Additionally, a popup message will prompt the user to move to the login page.

![Screenshot 3](/screenshots/screenshot3.png)
This page represents the login process.

![Screenshot 4](/screenshots/screenshot4.png)
If the user enters an incorrect password, a popup appears, asking whether the user wants to reset the password.

![Screenshot 5](/screenshots/screenshot5.png)
If the user clicks 'OK' on the previous page, on this page, the user is provided with the functionality to reset the password in case of a forgotten password.

![Screenshot 6](/screenshots/screenshot6.png)
After successfully resetting the password, a notification on this page indicates that the password has been successfully reset.

![Screenshot 7](/screenshots/screenshot7.png)
Upon logging in, a welcoming message appears in the upper right corner, acknowledging the user and providing an option to log out.

![Screenshot 8](/screenshots/screenshot8.png)
Moving to the "Deck" category window, users can create new decks, as shown in the screenshot.

![Screenshot 9](/screenshots/screenshot9.png)
When creating a new deck, a window prompts the user to enter a name for the new deck.

![Screenshot 10](/screenshots/screenshot10.png)
After completing the entry and clicking the "Create" button, a popup confirms the successful creation of the new deck.

![Screenshot 11](/screenshots/screenshot11.png)
The deck list includes categories such as English, French, History, and Mathematics, and users have the option to add more if desired.

![Screenshot 12](/screenshots/screenshot12.png)
![Screenshot 13](/screenshots/screenshot13.png)
Users can modify their deck list at any time, as illustrated in the screenshot where the user is seen editing the name of a deck.

![Screenshot 14](/screenshots/screenshot14.png)
After completing the modification, a popup indicates that the deck has been successfully updated, with the name reflecting the newly set name.

![Screenshot 15](/screenshots/screenshot15.png)
The user has the option to delete deck lists. 

![Screenshot 16](/screenshots/screenshot16.png)
Upon pressing the delete button for a deck list, a confirmation popup appears, asking the user to confirm the deletion.

![Screenshot 17](/screenshots/screenshot17.png)
![Screenshot 18](/screenshots/screenshot18.png)
If the user clicks the OK button, a popup indicating the successful deletion appears, and the 'history' deck is removed from the list.

![Screenshot 19](/screenshots/screenshot19.png)
On the current page, users can select a deck list they created earlier and write words for both sides of a flashcard.

![Screenshot 20](/screenshots/screenshot20.png)
In the provided screenshot, the user chose the 'English' deck from the list, entering '봄' on the front side and 'spring' on the back side.

![Screenshot 21](/screenshots/screenshot21.png)
After completion, clicking the 'Add' button triggers a popup confirming the successful addition of the flashcard to the deck.

![Screenshot 22](/screenshots/screenshot22.png)
Additionally, when selecting a deck in the display flashcards section, all flashcards associated with that deck are listed. This allows users to view the saved seasonal words, starting from '봄' that they entered earlier.

![Screenshot 23](/screenshots/screenshot23.png)
In the 'Display Flashcards' section, users have the capability to edit flashcards. Let's try modifying the flashcard for '봄.'

![Screenshot 24](/screenshots/screenshot24.png)
The front side, initially set as '봄,' has been updated to '이른 봄,' and the back side, initially set as 'spring,' has been changed to 'early spring.'

![Screenshot 25](/screenshots/screenshot25.png)
Upon clicking 'Save,' the successful modification of the flashcard from '봄' to '이른 봄' can be confirmed.

![Screenshot 26](/screenshots/screenshot26.png)
Furthermore, users can also delete flashcards.

![Screenshot 27](/screenshots/screenshot27.png)
![Screenshot 28](/screenshots/screenshot28.png)
After pressing the delete button and confirming the intent to delete the flashcard by clicking 'OK' in the popup, the flashcard count decreases from 4 to 3, indicating that a flashcard has been successfully deleted.

![Screenshot 29](/screenshots/screenshot29.png)
The following represents the learning phase using the created deck and flashcards.

![Screenshot 30](/screenshots/screenshot30.png)
First, the user selects the deck they want to study.

![Screenshot 31](/screenshots/screenshot31.png)
Next, the user determines the study direction, choosing between basic (front-back) or reverse (back-front).

![Screenshot 32](/screenshots/screenshot32.png)
In the third step, the user decides the order in which the saved flashcards will be studied: 1. sequential, 2. randome, or 3. reverse order.

![Screenshot 33](/screenshots/screenshot33.png)
In the presented screenshot, the chosen deck is 'Math_advanced,' the study direction is set to basic, and the study order is sequential.

![Screenshot 34](/screenshots/screenshot34.png)
![Screenshot 35](/screenshots/screenshot35.png)
![Screenshot 36](/screenshots/screenshot36.png)
Initially, the front side of the flashcard is displayed. Clicking the 'Show Answer' button reveals the answer. At this point, the user can press either 'Got it' or 'Missed it' to indicate their understanding.

![Screenshot 37](/screenshots/screenshot37.png)
?
![Screenshot 38](/screenshots/screenshot38.png)
?
![Screenshot 39](/screenshots/screenshot39.png)
Pressing the "Next" button advances to the next card, as shown in the screenshot.

![Screenshot 40](/screenshots/screenshot40.png)
Similarly, upon completing the learning process up to the last flashcard, a popup appears indicating that there are no more cards available.

![Screenshot 41](/screenshots/screenshot41.png)
When both the card direction and order are set to "reverse," the starting point becomes '6back.'

![Screenshot 42](/screenshots/screenshot42.png)
Confirming the application of both reverse card and study direction, observing '6back' as the starting point and '6front' as the answer.

![Screenshot 43](/screenshots/screenshot43.png)
After completing the learning session, a popup indicates that there are no more cards.

![Screenshot 44](/screenshots/screenshot44.png)
?

![Screenshot 45](/screenshots/screenshot45.png)
Upon completing the study session, a popup confirms that the learning session has concluded.

![Screenshot 46](/screenshots/screenshot46.jpg)
![Screenshot 47](/screenshots/screenshot47.jpg)
![Screenshot 48](/screenshots/screenshot48.jpg)



![Screenshot 49](/screenshots/screenshot49.jpg)
In the previous version, only a single flashcard could be added. However, a new feature has been added to enable the upload of multiple flashcards via CSV, introducing the Multiple Flashcards additional functionality.

![Screenshot 50](/screenshots/screenshot50.jpg)
I selected the 'English' deck from among the 'English,' 'French,' and 'Math_advanced' decks, similar to the previous version.

![Screenshot 51](/screenshots/screenshot51.jpg)
For the 'Front,' I wrote 'Hello' in Korean, and for the 'Back,' I wrote 'Hello' in English.

![Screenshot 52](/screenshots/screenshot52.jpg)
Upon clicking the 'Add Card' button, the flashcard is stored in the deck and adds a row to the 'funedudb' database under the 'english' deck.

![Screenshot 53](/screenshots/screenshot53.jpg)
The added flashcards, when the user selects a deck in the 'Display Flashcards' section, display all previously added items from the database. Users can choose from the added 'deck' items.

![Screenshot 54](/screenshots/screenshot54.jpg)
The 'Hello' item added as a single flashcard is visible.

![Screenshot 55](/screenshots/screenshot55.jpg)
Let's assume the user uploads an entire CSV file named 'new_flashcard1.csv.' 

![Screenshot 56](/screenshots/screenshot56.jpg)
Like a single flashcard, the user first sets the deck, in this case, to 'English.'

![Screenshot 57](/screenshots/screenshot57.jpg)
Before the user selects a file, the previously non-existent guidance text 'No file chosen' appears.

![Screenshot 58](/screenshots/screenshot58.jpg)
Subsequently, the user selects and uploads the 'new_flashcard1.csv' file.

![Screenshot 59](/screenshots/screenshot59.jpg)
Upon selection, the chosen file is displayed in the 'Choose file' field.

![Screenshot 60](/screenshots/screenshot60.jpg)
After selecting 'Upload File,' a notification message appears: 'Flashcards added to deck.'

![Screenshot 61](/screenshots/screenshot61.jpg)
Similar to adding a single flashcard, the user checks the 'Display Flashcards' section.

![Screenshot 62](/screenshots/screenshot62.jpg)
In this view, alongside the previously added 'Hello' word, all items from the newly added file, including 'spring,' 'summer,' 'fall,' and 'winter,' are visible.

![Screenshot 63_1](/screenshots/screenshot63_1.jpg)
![Screenshot 63_2](/screenshots/screenshot63_2.jpg)
If the user clicks the 'Edit' button, both the 'front' and 'back' parts can be modified.

![Screenshot 64_1](/screenshots/screenshot64_1.jpg)
![Screenshot 64_2](/screenshots/screenshot64_2.jpg)
When the user clicks the 'Delete' button, one word can be deleted from the multiple words added via CSV.

![Screenshot 65](/screenshots/screenshot65.jpg)
During deletion, unlike the 'Edit' button, the user is prompted with a confirmation message: 'Are you sure you want to delete this flashcard?'

![Screenshot 66](/screenshots/screenshot66.jpg)
Only the 'winter' item is deleted, and upon rechecking the 'display flashcards' section, only four words, excluding 'winter,' are visible to the use

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

# To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

=======

# EduFun

Learning application
9680577ad9295f864d3887af889a99d1a372ba1c
