# spatial compute, but for real

Demo link: https://spatial-compute.threepointone.workers.dev/

_(WIP, pulling technology from the future isn't instantaneous)_

This is a demo of the spatial compute model, [as detailed here](https://sunilpai.dev/posts/spatial-compute/).

The actual app is based on [this repo by @rauchg](https://github.com/rauchg/how-is-this-not-illegal/).

Read the blog post for more details, but to set some context:

- Moving all compute to the edge is bad for performance when your data is located far from the user, because the back and forth from the database increases latency dramatically
- Moving all compute close to the data is bad for initial load /render time
- Different types of data have to be located in differnt locations; caches and sessions have to be close to the user, but databases are encouraged to be in a central location.
- It's not fair to ask the developer to think about this and split up their apps and data into multiple services, they should just be able to write their app and let the system figure out where things need to live.

**So, in this repo:**

- Code for the React App is under `./src/app`
- Code for the Server is under `./src/server`
- Code for the Data Fetching is under `./src/data`
- (In the future, the Data Fetching and Server will be combined into a single worker)
- We have a prerender script under `./src/prerender` that's run during build time to generate the app "shell" / skeleton that's first sent to the client.
- The whole app is plain React SSR, with no client side hydration (yet).

**Here's the timeline of what happens when you visit the site:**

- A response stream is started from the eyeball worker
- It _immediately_ streams a prerendered html app "shell"
- Reads a session id from the cookie header (or creates a new one if not present)
- The request is passed on to the session server / durable object
- React kicks in and starts rendering
- It starts fetching data, on a binding to a smart placed worker
- the smart placed worker reads from D1, our pokemon database, and returns data
- The session server receives the data and continues generating html / script tags with out-of-order streaming
- Streams this to the user back through the eyeball

![https://sunilpai.dev/_astro/after.YNLWiuq6_1619LO.webp](https://sunilpai.dev/_astro/after.YNLWiuq6_1619LO.webp)

**From the user's perspective:**

- Incredible fast ttfb / initial html being served with a "spinner" / skeleton
- Content streams into the page as it's ready without layout shift / jank
- The whole thing happens in ONE request (check the html!)

https://github.com/user-attachments/assets/f2c6dee0-5588-40d3-8e8f-a973280788aa

**As a developer:**

- You write a React app as you please (This demo isn't nextjs or remix or rsc or whatever. it's just React)
- Put your data fetches inside WorkerEntryPoints (Todo, right now we use service bindings)
- Every user's session server does the actual rendering, with access to an ultra fast session store.
- Cloudflare locates the data and session servers based on the data access patterns.

## Testing this locally

- You'll have to setup the d1 with `schema.sql`
- In one tab, run `npm start`
- In another tab, run `npm run data`
- `open http://localhost:8787`

## TODO

- [x] - remove the rate limiter, it's not useful for this demo
- [x] - make duplicate sql calls from the data fetching worker
- [x] - add a query param to the url to toggle between smart placed / edge based data fetching
- [x] - add some illustrations to this readme
- [x] - setup a session id if not already, otherwise read from cookie header
- [ ] - use session data in some way (update a view counter?)
- [ ] - automatically detect i/o while prerendering (or just default to first suspense boundary)
- [ ] - add client side hydration / interactivity to the app
- [ ] - show locations of data and session servers on the demo page (https://www.cloudflare.com/cdn-cgi/trace)
