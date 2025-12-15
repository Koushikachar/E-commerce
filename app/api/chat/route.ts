import { streamText, type UIMessage, convertToCoreMessages } from "ai";
import { auth } from "@clerk/nextjs/server";
import { createShoppingAgent } from "@/lib/ai/shopping-agent";

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  // Get user (null if not authenticated)
  const { userId } = await auth();

  // Create agent config (NOT an agent instance)
  const agent = createShoppingAgent({ userId });

  const result = await streamText({
    model: agent.model,
    system: agent.instructions,
    messages: convertToCoreMessages(messages),
    tools: agent.tools,
  });

  return result.toTextStreamResponse();
}
