import { PokemonList, Pokemon } from "./components";
import { suspend } from "suspend-react";
import postpone from "./postpone";

import getLocation, { Place } from "../server/getLocation";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function Locations({
  eyeball,
  session,
  data,
  timing,
  sessionId,
}: {
  eyeball: Place;
  session: Place;
  data: Place;
  timing: number;
  sessionId: string;
}) {
  return (
    <table
      className="min-w-full bg-gray-800 border border-gray-700 shadow-md rounded-lg overflow-hidden"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <thead className="bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Position
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Colo
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Loc
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        <tr className="hover:bg-gray-700">
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">Eyeball</td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
            {eyeball.colo}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
            {eyeball.loc}
          </td>
        </tr>
        <tr className="hover:bg-gray-700">
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">Session</td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
            {session.colo}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
            {session.loc}
          </td>
        </tr>
        <tr className="hover:bg-gray-700">
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">Data</td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
            {data.colo}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
            {data.loc}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Timing
          </td>
          <td className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            {timing}
          </td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Session ID
          </td>
          <td className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            {sessionId}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default function Home({
  POKEMON,
  DB,
  smart,
  locations,
  ANALYTICS,
  sessionId,
}: {
  POKEMON: Service;
  smart: boolean;
  DB: D1Database;
  ANALYTICS: AnalyticsEngineDataset;
  locations: {
    eyeball: Place;
    session: Place;
  };
  sessionId: string;
}) {
  postpone(); // TODO: trigger this automatically if any i/o is made

  const results = suspend(async () => {
    const start = performance.now();
    // await sleep(500);
    if (smart) {
      // let's just do it serially a bunch of times to simulate back and forth

      // this one's the actual one we care about
      const res = await POKEMON.fetch(`http://dummy.com/api/pokemon`);
      const end = performance.now();

      const result = {
        ...(await res.json<{
          rows: {
            id: number;
            name: string;
          }[];
          dataLocation: Place;
        }>()),
        timing: end - start,
      };

      ANALYTICS?.writeDataPoint({
        blobs: [
          locations.eyeball.loc,
          locations.eyeball.colo,
          locations.session.loc,
          locations.session.colo,
          result.dataLocation.loc,
          result.dataLocation.colo,
        ],
        doubles: [result.timing],
        indexes: [sessionId],
      });

      return result;
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
      const end = performance.now();

      const result = {
        rows: results,
        dataLocation: locations.session,
        timing: end - start,
      };

      ANALYTICS?.writeDataPoint({
        blobs: [
          locations.eyeball.loc,
          locations.eyeball.colo,
          locations.session.loc,
          locations.session.colo,
          result.dataLocation.loc,
          result.dataLocation.colo,
        ],
        doubles: [end - start],
        indexes: [sessionId],
      });

      return result;
    }
  }, ["pokemon" + new Date().getSeconds() * 4]) as {
    rows: {
      id: number;
      name: string;
    }[];
    dataLocation: Place;
    timing: number;
  };

  return (
    <>
      <PokemonList>
        {results.rows.map((p) => (
          <Pokemon key={p.id} id={p.id} name={p.name} />
        ))}
      </PokemonList>
      <Locations
        eyeball={locations.eyeball}
        session={locations.session}
        data={results.dataLocation}
        timing={results.timing}
        sessionId={sessionId}
      />
    </>
  );
}
