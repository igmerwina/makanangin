"use client";

import { useEffect } from "react";
import { Globals } from "@react-spring/web";

/** Respect prefers-reduced-motion globally for every react-spring animation on the site. */
export default function MotionSetup() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => Globals.assign({ skipAnimation: mq.matches });
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return null;
}
