#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const isValidGetRandomNumberArgs = (args: any): args is { max?: number } =>
  typeof args === "object" &&
  args !== null &&
  (args.max === undefined || typeof args.max === "number");

class RandomNumberServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: "random-number-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: "https://www.random.org",
    });

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_random_number",
          description: "Get a random integer from random.org",
          inputSchema: {
            type: "object",
            properties: {
              max: {
                type: "number",
                description: "Maximum value (inclusive)",
                minimum: 1,
              },
            },
            required: [],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== "get_random_number") {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      if (!isValidGetRandomNumberArgs(request.params.arguments)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Invalid get_random_number arguments"
        );
      }

      const max = request.params.arguments.max || 100;

      try {
        const response = await this.axiosInstance.get("/integers/", {
          params: {
            num: 1,
            min: 1,
            max: max,
            col: 1,
            base: 10,
            format: "plain",
            rnd: "new",
          },
        });

        return {
          content: [
            {
              type: "text",
              text: String(response.data),
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [
              {
                type: "text",
                text: `Random.org API error: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Random Number MCP server running on stdio");
  }
}

const server = new RandomNumberServer();
server.run().catch(console.error);
