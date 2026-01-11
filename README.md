# GithubTrendingCLI

A small project that provides a backend service to fetch trending GitHub repositories and a lightweight CLI to display them. The repository contains two parts:

- `backend/` — an Express-based API that queries the GitHub Search API and returns trending repositories.
- `trendingRepoCLI/` — an Oclif-based TypeScript CLI that calls the backend and prints a compact ranked list.

**Quick Summary**
- **Backend:** Node + Express, endpoint: `GET /api/repos/trending` (query params: `duration`, `limit`).
- **CLI:** Oclif command `trending-repo` which queries the backend and prints top repositories.

**Requirements**
- **Node.js:** >= 18
- **npm** or **pnpm/yarn**

**Why set a GitHub token?**
The backend uses `octokit` without authentication by default, which is subject to stricter rate limits. To increase rate limits, set a `GITHUB_TOKEN` environment variable (personal access token) before starting the backend. If you set it, Octokit will use it automatically if you update `backend/services/githubService.js` to pass `auth: process.env.GITHUB_TOKEN` to `new Octokit(...)`.

**Project Structure (important files)**
- `backend/app.js` — Express app and server bootstrap.
- `backend/routes/repoRouter.js` — defines `/api/repos/trending`.
- `backend/controllers/repoController.js` — validates input and normalizes repo data.
- `backend/services/githubService.js` — calls GitHub Search API via `octokit`.
- `trendingRepoCLI/src/commands/trending-repo.ts` — CLI command that calls the backend.

**Backend — Install & Run**
1. Change to the backend folder:

```bash
cd basics/GithubTrendingCLI/backend
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a `.env` file at `backend/.env` and add a GitHub token to reduce rate limits:

```bash
# .env
GITHUB_TOKEN=ghp_your_personal_token_here
PORT=3000
```

4. Start the backend in development mode (uses `nodemon`):

```bash
npm run dev
```

5. Health check:

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

**Backend — API Usage**
- Endpoint: `GET /api/repos/trending`
- Query parameters:
  - `duration` (string): one of `day`, `week`, `month`, `year` (default: `week` in router; CLI default is `day`).
  - `limit` (integer): number of repos to return (1–100, default: 10).

Example:

```bash
curl "http://localhost:3000/api/repos/trending?duration=week&limit=5"
```

Response: JSON array of repositories with fields `name`, `owner`, `description`, `stars`, `language`, `url`.

**CLI — Install & Run (development)**
1. Change to the CLI folder:

```bash
cd basics/GithubTrendingCLI/trendingRepoCLI
```

2. Install dependencies:

```bash
npm install
```

3. Run the CLI in development (local executable `gt` / `github-trending`):

```bash
# If you have linked or installed the CLI, run using the new executable names:
gt trending-repo --duration week --limit 10
# or
github-trending trending-repo --duration week --limit 10
```

Or run the CLI directly from the built output:

```bash
npm run build
node ./dist/index.js trending-repo --duration week --limit 10
```

If you'd like to use `gt` (or `github-trending`) locally without rebuilding every time, you can link the package:

```bash
cd basics/GithubTrendingCLI/trendingRepoCLI
npm link
# now `gt` or `github-trending` should be available globally in your shell
```

The CLI expects the backend to be running on `http://localhost:3000` and will show a short ranked list like:

```
1: repo-name ⭐ 1234
2: other-repo ⭐ 987
...
```

**Deployed Backend & Auto-detection**
- This project includes a deployed backend (Render) at `https://githubtrendingrepos.onrender.com`. The CLI will attempt to use that deployed URL first and automatically fall back to `http://localhost:3000` if the deployed service is not reachable.
- The auto-detection is implemented in `trendingRepoCLI/src/service/backend-url.ts` (used by `trendingRepoCLI/src/commands/trending-repo.ts`). You can open those files to see the exact behavior.

How it works:
- `getBackendURL()` pings the deployed URL's `/health` endpoint with a short timeout. If reachable, the CLI uses the deployed URL. If not, it uses the local backend URL.

Override the backend URL
- To force the CLI to use a specific backend, edit `trendingRepoCLI/src/service/backend-url.ts` and change the `BACKEND_URL` or `LOCAL_BACKEND_URL` constants. For example, to force local-only use, set `const BACKEND_URL = ''` or remove/empty the deployed URL.
- Alternatively you can modify `trendingRepoCLI/src/commands/trending-repo.ts` to read a runtime environment variable and use that value (recommended if you prefer configuration without editing source).


**Troubleshooting**
- If the CLI prints `Backend server is not reachable`, ensure the backend is running and accessible at `http://localhost:3000`.
- If you see API rate limit errors, add a `GITHUB_TOKEN` and (optionally) update `backend/services/githubService.js` to authenticate the Octokit client with it.
- Ensure Node.js version is compatible (>=18).

**Notes & Next Steps**
- You can improve the project by adding authentication to Octokit (use `GITHUB_TOKEN`), adding tests, or packaging the CLI for global install.
- The backend currently validates inputs and normalizes responses; feel free to add more fields or caching to reduce GitHub API calls.

**License & Repo**
- This project references `AtharvaKatiyar/GithubTrendingRepos` as the upstream repository. Check that repo for issues and contributions.
