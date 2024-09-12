import Loading from "./loading";
import Layout from "./layout";
import Home from "./home";

import { Suspense } from "react";
import { Place } from "../server/getLocation";

export default function App({
  POKEMON,
  DB,
  smart,
  locations,
  ANALYTICS,
  sessionId,
}: {
  POKEMON: Service;
  DB: D1Database;
  ANALYTICS: AnalyticsEngineDataset;
  smart: boolean;
  locations: {
    eyeball: Place;
    session: Place;
  };
  sessionId: string;
}) {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Home
          POKEMON={POKEMON}
          DB={DB}
          smart={smart}
          locations={locations}
          ANALYTICS={ANALYTICS}
          sessionId={sessionId}
        />
      </Suspense>
    </Layout>
  );
}
