import Loading from "./loading";
import Layout from "./layout";
import Home from "./home";
import { Suspense } from "react";

export default function App({ POKEMON }: { POKEMON: Service }) {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Home POKEMON={POKEMON} />
      </Suspense>
    </Layout>
  );
}
