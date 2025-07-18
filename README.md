# Sistema de Facturación - Backend

This project uses Node.js, PostgreSQL, and Prisma to manage the database.

For the frontend, visit:  
https://github.com/Antonio-Conrado/sistema-facturacion

---

## Prerequisites

-   [Node.js](https://nodejs.org/) (recommended LTS version)
-   [Docker](https://www.docker.com/get-started) and Docker Compose
-   [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

---

## Getting Started

1. Clone this repository:

    ```bash
    git clone https://github.com/Antonio-Conrado/Sistema-de-Facturacion-Backend.git
    ```

2. Navigate to the project folder:

    ```bash
    cd Sistema-de-Facturacion-Backend
    ```

3. Create a `.env` file in the root directory by copying the template and updating the values with your own:

    ```bash
    cp .env.template .env
    ```

4. Install the dependencies:

    ```bash
    npm i
    ```

5. Start the database using Docker:

    ```bash
    docker compose up -d
    ```

6. Run Prisma migrations and generate the client:

    ```bash
    npx prisma migrate dev
    ```

7. Start the development server:

-   To run the standard development server:

    ```bash
    npm run dev
    ```

-   To run the API server for testing with Postman or Insomnia:

    ```bash
    npm run dev:api
    ```

8. Seed the database by calling the seed endpoint with a parameter indicating the seed type. Use `basicSeed` for essential system data, or `fullSeed` for comprehensive test data.

Replace `{param}` with either `basicSeed` or `fullSeed`.

Examples:

-   http://localhost:4000/api/v1/seed/basicSeed
-   http://localhost:4000/api/v1/seed/fullSeed
