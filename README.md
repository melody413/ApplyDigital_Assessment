# NestJS Contentful Product Sync API

This project is a NestJS-based API that syncs Contentful 'Product' entries to MongoDB every hour, provides public paginated/filterable REST endpoints, private JWT-protected report endpoints, and is fully Dockerized.

## Features

- **Contentful Sync:** Automatically syncs 'Product' entries from Contentful to MongoDB every hour.
- **REST API:** Public endpoints for paginated and filterable product queries.
- **Reports:** Private, JWT-protected endpoints for generating reports.
- **MongoDB Integration:** Uses Mongoose for schema-based MongoDB access.
- **Swagger Docs:** API documentation available at `/api/docs`.
- **Validation:** DTOs and validation for all endpoints.
- **Dockerized:** Ready for containerized deployment.
- **CI/CD:** GitHub Actions for linting and testing.
- **Best Practices:** Modular NestJS code, conventional commits, and gitflow.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [Mongoose](https://mongoosejs.com/) (MongoDB ODM)
- [Contentful](https://www.contentful.com/) (Headless CMS)
- [Swagger](https://swagger.io/) (API documentation)
- [Docker](https://www.docker.com/)
- [GitHub Actions](https://github.com/features/actions) (CI/CD)
- [JWT](https://jwt.io/) (Authentication)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) (for containerized setup)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Contentful](https://www.contentful.com/) account and API keys

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
MONGODB_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your_jwt_secret
```

### Local Development

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Run the server:**
   ```powershell
   npm run start:dev
   ```

3. **Access Swagger docs:**
   - Visit [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Running with Docker

1. **Build and start containers:**
   ```powershell
   docker-compose up --build
   ```

2. **The API will be available at** `http://localhost:3000`

### Testing & Linting

- **Run tests:**
  ```powershell
  npm run test
  ```
- **Run linter:**
  ```powershell
  npm run lint
  ```

### CI/CD

- GitHub Actions are configured to run tests and lint checks on every push.

## API Overview

- **Public Endpoints:** `/products` (pagination, filtering)
- **Private Endpoints:** `/reports` (JWT required)
- **Auth:** JWT-based authentication for protected routes

## Contributing

- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Follow [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow
