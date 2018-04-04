# Book Search Fullstack Capstone
The purpose of this app is to find a book recommendations from Goodread's API

# MVP workflow
* Introduction screen.
* --> Explanation of the application
* ----> Click to Enter
* ------> login to page to enter to the site.
* --------> Search for books
* --------> select books.
* ----------> Add to favorites to return later.
* Screen displays book recommendations.
* --> User can edit the book list.
* ----> Click to continue.
* ------> Final book list with user review .
* --------> User can add book review to favorites

# User Stories
* As a user I want to quickly understand the purpose of the site in order to use it to create a shopping list.
![Landing page screen shot](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/pic1.png)
* As a user I want to be able to login so I can return to the site and view saved recipes to favorites.
![Landing page screen shot](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/pic2.png)
* As a user I want to search for recipes that I would like to create a shopping list for.
![Landing page screen shot](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/pic3.png)
* As a user I want to select recipes or just recipe that I would liket to create a shopping list for.
![Landing page screen shot](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/pic4.png)
* As a user I want to be able to edit my shopping list, save to my favorites so I can revist later or print the list.
![Landing page screen shot](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/pic5.png)

## Screenshots
![Landing page screen shot](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot1.png)
![Login page](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot2.png)
![Register new user](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot3.png)
![Search recipes](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot4.png)
![Displays list of recipes](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot5.png)
![Displays list of recipes](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot6.png)
![Displays added list of ingredients from recipes](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot7.png)
![Displays added list of ingredients from recipes](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot8.png)
![Print page](https://github.com/DianeCho/shopping-list-node-capstone/blob/master/github-images/Screenshot9.png)

## Working Prototype
Find a working prototype with Node at https://book-search-fullstack-capstone.herokuapp.com/ .

## Functionality
* When the user brings up the main page it explains the purpose of the application.
* The user then enters the app and logs in.  After they are logged in, the user is now redirected to search bar.
* The user can search for recipes and select the recipes.
* The user can generate a shopping list and edit the shopping list.
* The user can print the final shopping list or save to their favorites to revisit at a later time.


## Technical

#### Front End
* HTML5
* CSS3
* JavaScript
* jQuery

#### Back End
* Node.js with Heroku implementation
* Express.js
* MongoDB on mLab
* Mongoose
* Mocha and Chai
* Goodreads API

#### Responsive

* The app is responsive and optimized for both desktop and mobile viewing and use


## API Documentation
API endpoints for the back end include:
* POST to '/users/create' for creating a new user
* POST to '/signin' to sign in an existing user
* POST to '/new/create' to add an achievement to a user's list of accomplishments
* PUT to '/achievement/:id' to update an existing achievement
* GET to '/achievements/:user' to access all of a user's existing achievements
* GET to '/achievement/:id' to access a single achievement by ID
* DELETE to '/achievement/:id' to delete a single achievement by ID

## Development Roadmap
Planned additional features and improvements will allow users to:
* Add user login.
* Currently only one user at a time can use the app, scale it up to multiple users.
