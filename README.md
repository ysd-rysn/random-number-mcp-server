# Random Number MCP Server

This project implements a simple Model Context Protocol (MCP) server that provides a tool to generate random numbers using the [random.org](https://www.random.org/) API.

## Overview

This server demonstrates the basic concepts of MCP, including:

-   Setting up an MCP server.
-   Defining and implementing tools.
-   Integrating with an external API.
-   Configuring the server for use with MCP clients.

## Prerequisites

-   Node.js and npm installed.
- An MCP client such as the Claude desktop app.

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone [repository_url]
    cd [project_directory]
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## API

The server uses the [random.org](https://www.random.org/) API to generate true random numbers. No API key is required for basic usage.

## MCP Server Implementation

The server is implemented in `index.ts` and uses the `@modelcontextprotocol/sdk` to handle MCP communication.

### Tool: `get_random_number`

This tool retrieves a random integer from the random.org API.

**Input Parameters:**

-   `max` (optional): An integer specifying the maximum value (inclusive) of the random number. Defaults to 100.

**Output:**

-   A string containing the random number.

## Server Configuration

The server is configured through the `cline_mcp_settings.json` file. You need to add an entry for this server, specifying the command to run it:

```json
{
  "mcpServers": {
    "random-number": {
      "command": "node",
      "args": ["[path/to/index.js]"],
      "env": {}
    }
  }
}
```
Replace `[path/to/index.js]` with the actual path to the compiled `index.js` file (usually in a `build` or `dist` directory after running `npm run build`).

## Running the Server
1. Build the server
    ```bash
    npm run build
    ```
2.  Start the server (this is typically done automatically by the MCP client after configuration).

## Usage

Once the server is running and configured, you can use the `get_random_number` tool through your MCP client.
