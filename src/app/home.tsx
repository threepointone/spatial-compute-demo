import { PokemonList, Pokemon } from "./components";
import { suspend } from "suspend-react";
import postpone from "./postpone";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Home({
  POKEMON,
  DB,
  smart,
}: {
  POKEMON: Service;
  smart: boolean;
  DB: D1Database;
}) {
  postpone(); // TODO: trigger this automatically if any i/o is made

  const rows = suspend(async () => {
    // await sleep(500);
    if (smart) {
      // let's just do it serially a bunch of times to simulate back and forth
      await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      // this one's the actual one we care about
      const res = await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      return res.json();
    } else {
      await DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      await DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      const { results } = await DB.prepare(
        "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12"
      ).all();
      return results;
    }
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
