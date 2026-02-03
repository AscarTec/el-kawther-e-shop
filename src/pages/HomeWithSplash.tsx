import React, { useState } from "react";
import HomePage from "./HomePage";
import { SplashScreen } from "@/components/SplashScreen";

export default function HomeWithSplash() {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <SplashScreen onDone={() => setDone(true)} skipIfSeen />}
      {done && <HomePage />}
    </>
  );
}
