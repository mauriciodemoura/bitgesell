# Refactor blocking I/O
- What was done:
Replaced all synchronous file operations (fs.readFileSync and fs.writeFileSync) in src/routes/items.js with their asynchronous, non-blocking counterparts using fs.promises.readFile and fs.promises.writeFile. This prevents event loop blocking and improves server scalability.

# Performance
- What was done:
Optimized the /api/stats endpoint to cache computed statistics and only recalculate when the underlying items.json file changes. Implemented a file watcher and smart cache validation to avoid redundant computations on every request, improving response times and server performance.

# Testing
- What was done:
Added a comprehensive suite of unit tests for the items routes using Jest and Supertest. Tests cover happy paths (listing, filtering, retrieving, and creating items) as well as error cases (not found, internal errors), ensuring correctness and robustness of the API endpoints.