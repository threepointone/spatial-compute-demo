export type Place = {
  colo: string;
  loc: string;
};

export default async function getLocation(): Promise<Place> {
  return fetch("https://www.cloudflare.com/cdn-cgi/trace")
    .then((r) => r.text())
    .then((text) => {
      const lines = text.split("\n");
      return {
        colo: lines.find((line) => line.startsWith("colo="))?.split("=")[1]!,
        loc: lines.find((line) => line.startsWith("loc="))?.split("=")[1]!,
      };
    });
}
