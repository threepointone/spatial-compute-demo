import getLocation from "../server/getLocation";

type Env = {
  DB: D1Database;
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/pokemon") {
      // If you did not use `DB` as your binding name, change it here
      await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      const { results } = await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      return Response.json(
        {
          rows: results,
          dataLocation: await getLocation(),
        },
        {
          headers: {
            // set caching header so it never caches
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        }
      );
    }

    return new Response("Not found", { status: 404 });
  },
};
