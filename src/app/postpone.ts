// @ts-expect-error no types for this yet
import { unstable_postpone } from "react";
declare const IS_PRERENDER: boolean | undefined;

export default function postpone() {
  if (typeof IS_PRERENDER !== "undefined" && IS_PRERENDER) {
    unstable_postpone();
  }
}
