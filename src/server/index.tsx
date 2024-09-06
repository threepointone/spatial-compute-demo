import { Server, getServerByName } from "partyserver";
// @ts-expect-error no types
import { resumeToPipeableStream } from "react-dom/server.node";
import postponed from "./postponed.json";
// @ts-expect-error no types
import preludeHTML from "./prelude.html";
import App from "../app";
// @ts-expect-error no types
import { PassThrough, Stream } from "node:stream";

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

type Env = {
  POKEMON: Service;
  Session: DurableObjectNamespace<Session>;
  LIMITER: RateLimit;
};

// Function to convert a Node.js pipeable stream into a Web ReadableStream
function toWebReadableStream(pipeableStream: Stream) {
  // Create a PassThrough stream to read data chunk by chunk
  const passthrough = new PassThrough();

  // Pipe the Node.js stream into the PassThrough stream
  pipeableStream.pipe(passthrough);

  return new ReadableStream({
    start(controller) {
      const reader = passthrough[Symbol.asyncIterator]();

      const pump = async () => {
        try {
          for await (const chunk of reader) {
            // Enqueue each chunk into the Web ReadableStream
            controller.enqueue(chunk);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      };

      pump();
    },
    cancel() {
      // Abort the Node.js stream when the web ReadableStream is canceled
      pipeableStream.abort();
      passthrough.destroy();
    },
  });
}

export class Session extends Server<Env> {
  async onRequest(request: Request) {
    const resumed = await resumeToPipeableStream(
      <App POKEMON={this.env.POKEMON} />,
      JSON.parse(JSON.stringify(postponed))
    );

    return new Response(toWebReadableStream(resumed), {
      headers: {
        "Content-Type": "text/html",
        "content-encoding": "identity",
        "Transfer-Encoding": "chunked",
      },
    });
  }
}

const SESSION_ID = "my-session-id";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // const { success } = await env.LIMITER.limit({ key: SESSION_ID });

    // if (!success) {
    //   return new Response("Rate limit exceeded", { status: 429 });
    // }

    const stub = await getServerByName(env.Session, SESSION_ID);
    const restOfResponse = await stub.fetch(request);

    // we want to start a new reponse that first writes the prelude HTML,
    // then streams restOfResponse

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            controller.enqueue(new TextEncoder().encode(preludeHTML));
            assert(restOfResponse.body, "restOfResponse.body is null");
            for await (const chunk of restOfResponse.body) {
              controller.enqueue(chunk);
            }
          } catch (e) {
            console.error(e);
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/html",
          "content-encoding": "identity",
          "Transfer-Encoding": "chunked",
        },
      }
    );
  },
} satisfies ExportedHandler<Env>;
