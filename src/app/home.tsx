import { PokemonList, Pokemon } from "./components";
import { suspend } from "suspend-react";
import postpone from "./postpone";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Home({ POKEMON }: { POKEMON: Service }) {
  postpone(); // TODO: trigger this automatically if any i/o is made

  const rows = suspend(async () => {
    await sleep(500);
    const res = await POKEMON.fetch(`http://dummy.com/api/pokemon`);
    return res.json();
  }, ["pokemon" + new Date().getSeconds() * 4]) as {
    id: number;
    name: string;
  }[];

  return (
    <PokemonList>
      {rows.map((p) => (
        <Pokemon key={p.id} id={p.id} name={p.name} />
      ))}
    </PokemonList>
  );
}
