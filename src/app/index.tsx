import Loading from "./loading";
import Layout from "./layout";
import Home from "./home";
import { Suspense } from "react";

export default function App({
  POKEMON,
  DB,
  smart,
}: {
  POKEMON: Service;
  DB: D1Database;
  smart: boolean;
}) {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Home POKEMON={POKEMON} DB={DB} smart={smart} />
      </Suspense>
    </Layout>
  );
}
