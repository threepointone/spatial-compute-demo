type Env = {
  DB: D1Database;
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/pokemon") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      return Response.json(results);
    }

    return new Response("Not found", { status: 404 });
  },
};
