# poros-web-backend-3.0 🌐

## Project Description 📜

The `poros-web-backend-3.0` project is a backend service designed to support the POROS web application. It provides RESTful APIs for managing organization members and blog posts, handling authentication, and facilitating communication between the frontend and the database. This project is built using modern web technologies to ensure scalability, security, and performance.

## ToDo (Next Development Iteration) 📝

1. **Integrate Front-End**: Connect the backend with the client front-end for the About Us and Dashboard pages.
2. **Update Member Divisions**: Modify the member's division structure to align with the current organization setup.
3. **Enhance Blogpost Functionality**: Add markdown support and integrate it into the blog post features.

## Tech Stack 🛠️
- Node.js
- Express
- Sequelize
- PostgreSQL

## Features ✨
- User Authentication and Authorization
- CRUD Operations for Managing Organization Members and Blog Posts
- Secure API Endpoints
- Comprehensive Error Handling

## Run Locally 🏠

To run this project locally, follow these steps:

1. Clone the repository:

  ```bash
  git clone https://github.com/porosub/poros-web-backend-3.0.git
  ```

2. Navigate to the project directory:

  ```bash
  cd poros-web-backend-3.0
  ```

3. Rename the `.env.example` file to `.env` and update the necessary environment variables:

  ```bash
  mv .env.example .env
  ```
  Open .env in your favorite editor and update the values as needed

4. Install the dependencies:

  ```bash
  npm install
  ```

5. Run the application:

  ```bash
  npm run dev
  ```

  ## API Testing using Postman Collection

  The provided Postman collection file `POROS-WEB-BACKEND-3.0.postman_collection.json` contains a set of API requests for testing the backend of the Poros Web application. This collection is organized into several categories, each representing different functionalities of the application such as Authentication, Member, Achievement, and Work Program. 
