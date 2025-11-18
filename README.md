# Chatrospective

This is a Next.js application that allows you to upload and analyze your chat conversations to gain insights into communication patterns, sentiment, and relationship dynamics. It uses Genkit and Google's Gemini models to perform the analysis.

## Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your system.

## Local Setup and Installation

Follow these steps to get your development environment set up:

1.  **Clone the Repository**

    If you haven't already, clone this project to your local machine.

    ```bash
    git clone <your-repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies**

    Install all the necessary npm packages listed in `package.json`.

    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**

    The application requires an API key from Google to use the Gemini AI models.

    a. Create a `.env.local` file in the root of your project directory:

    ```bash
    touch .env.local
    ```

    b. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    c. Open the `.env.local` file and add your API key in the following format:

    ```
    GOOGLE_API_KEY=your_actual_api_key_here
    ```

## Running the Application

This project requires two separate processes to be running simultaneously in two different terminal windows: the Next.js frontend and the Genkit AI server.

1.  **Start the Next.js Development Server**

    In your first terminal, run the following command to start the Next.js frontend.

    ```bash
    npm run dev
    ```

    This will typically start the application on `http://localhost:9002`.

2.  **Start the Genkit Development Server**

    In a second, separate terminal, run the following command to start the Genkit server, which manages the AI flows.

    ```bash
    npm run genkit:dev
    ```

    This server runs in the background and is what your Next.js app communicates with to perform AI analysis.

3.  **View the Application**

    Open your web browser and navigate to `http://localhost:9002`. You should now be able to use the application.

## Deploying to Vercel (production-ready notes)

This project is compatible with Vercel's Next.js hosting. There are a few important notes and steps you should follow to deploy successfully:

- **Environment variables**: Set the following environment variables in your Vercel project settings:
    - `GOOGLE_API_KEY` — required for the Google Gemini / Google AI plugin used by Genkit.

- **Genkit / AI flows**: The repository uses Genkit flows (see `src/ai/*`). In development we run the Genkit server locally via `npm run genkit:dev`. For production you have two recommended approaches:
    1. Host the Genkit server separately (e.g., on a small VM, Render, or a container). Keep it running and set an environment variable (or configure your Genkit deployment) so your Next.js app can talk to it. Configure any required keys (`GOOGLE_API_KEY`) in that environment as well.
    2. If you want to run the flows inside your Next.js runtime, check `@genkit-ai/next` documentation — some Genkit integrations allow embedding flows as Next.js server functions. If you choose this path, ensure `GOOGLE_API_KEY` is set in Vercel and test flows in a staging environment.

If you host Genkit separately, you can configure this app to forward client requests to your Genkit server by setting the `GENKIT_URL` environment variable in Vercel. This project includes a proxy endpoint at `/api/genkit-proxy` that will forward POST requests to the external Genkit server (keeps client secrets out of the browser and helps avoid CORS issues).

Example environment variables to set in Vercel:

- `GOOGLE_API_KEY` — API key for Google AI/Gemini
- `GENKIT_URL` — the public URL of your hosted Genkit server (for example `https://genkit.example.com/run`)

- **Set Node version**: Ensure your Vercel project's Node.js version is compatible (Node 18+ / 20 recommended). You can set the Node version in the Vercel project settings or add an `engines` field to `package.json` if desired.

- **Build & deploy**: Vercel will auto-detect this as a Next.js app. You can deploy directly from the GitHub repo. The included `vercel.json` ensures the Next.js builder is used.

Quick deploy checklist:

1. Push branch to GitHub.
2. In Vercel, import the repo and enable automatic deployments.
3. Add the `GOOGLE_API_KEY` env var in Vercel's dashboard (and any other secrets you use).
4. If using an external Genkit server, set an environment variable like `NEXT_PUBLIC_GENKIT_URL` or configure the client to point to the external host.

If you'd like, I can:

- Add a small API proxy (`/api/genkit-proxy`) that forwards requests to an externally hosted Genkit server (safer for client-side calls).
- Try to adapt genkit flows to run as Vercel serverless functions (if supported by your Genkit version).

Tell me which option you'd prefer and I will implement the required files and docs.
