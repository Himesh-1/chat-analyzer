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
