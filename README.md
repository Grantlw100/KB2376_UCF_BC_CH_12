# Tech Blog

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description
The Tech Blog is a CMS-style blog site, reminiscent of platforms like Wordpress, crafted to serve the tech community. Developers can share insights, publish articles, and engage with content posted by their peers. Built from scratch and deployed on Heroku, this application adheres to the MVC paradigm, employs Handlebars.js for templating, Sequelize as the ORM, and utilizes express-session for authentication.

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)
* [Features](#features)
* [Technology Used](#technologies-used)
* [Contributing](#contributing)
* [Contact](#contact)

## Installation
Clone the repository to your local machine.
Install necessary dependencies by running npm install.
Configure your environment variables for database access (.env).
Initialize the database using Sequelize migrations.
Start the application with npm start and navigate to the provided local URL.

## Usage
Visit the Site: Access the deployed application on Heroku.
Explore Content: Browse existing blog posts on the homepage.
Sign Up/In: Create an account or log in to interact with posts fully.
Dashboard: Publish new posts, or manage existing ones through the dashboard.
Interact with Posts: Leave comments on posts or read detailed post content.


## Credits

## License
This project is licensed under the MIT license.
https://opensource.org/licenses/MIT


## Features
Homepage Overview: Presents users with existing blog posts, navigation links, and login/sign-up options upon the first visit.
User Authentication: Supports user sign-up/sign-in functionality, with secure credential storage and authentication sessions.
Interactive Dashboard: Allows logged-in users to view, create, update, or delete their blog posts.
Post Interaction: Users can view detailed blog posts, including titles, content, and comments, and signed-in users can leave comments on posts.
Session Management: Automatically prompts users to log in again after being idle for a set period.
Acceptance Criteria
Provides a welcoming homepage with navigation options and a view of existing posts.
Includes user authentication for sign-up/sign-in with session management.
Features an interactive dashboard for users to manage their posts.
Allows users to interact with posts by adding comments and viewing post details.
Implements logout functionality and idle session re-authentication.

## Technologies Used
bcrypt
sequelize
dotenv
express
express-handlebars
mysql2

## Contributing
Contributions are welcome! If you'd like to contribute, please follow the standard fork and pull request workflow.

## Contact
If you have any questions, please feel free to reach out to me at Grant.L.Williams@outlook.com. You can also check out my GitHub profile at [GrantLW100](GrantLW100).