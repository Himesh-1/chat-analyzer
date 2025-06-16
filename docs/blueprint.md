# **App Name**: Chatrospective

## Core Features:

- Chat Log Upload: Accept a chat log file in a standard format (e.g., .txt, .json) via drag and drop. Display accepted filename.
- Chat Log Parsing: Analyze the chat log to extract messages, timestamps, and sender information.  The LLM uses a tool to decide when and if to correct chatlogs into the correct formatting for the LLM tool.
- Communication Analysis: Calculate key communication metrics, including total messages sent, average response time for each user, and message frequency over time. This feature also analyzes sentiment to find compliment count, frequently used words and emojis, and ghosting events.
- Data Visualization: Display the calculated communication metrics using charts, graphs, and summaries that showcase insights into communication dynamics.
- Relationship Story: Summarize the key insights from the chat log analysis. This summary presents a story from the relationship between the users.
- Temporarily Store Uploads: Persist uploads temporarily using the local storage

## Style Guidelines:

- Primary color: Deep purple (#6750A4) to evoke sophistication and introspection.
- Background color: Dark gray (#1A1A1D) to ensure readability and modern appeal.
- Accent color: Soft lavender (#D0BCFF) for highlighting interactive elements and key metrics.
- Body and headline font: 'Inter' (sans-serif) for clear data presentation and comfortable reading.
- Use simple, clear icons to represent metrics and actions.
- Employ a card-based layout to present individual metrics and insights.
- Use subtle transitions and animations to enhance user engagement when visualizing metrics.