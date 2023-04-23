import CharacterFetcher from "@/components/CharacterFetcher";
import Mounter from "@/components/Mounter";
import { useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(true);

  return (
    <div className="flex h-screen">
      <div className="m-auto w-[80%]">
        <Mounter setter={setMounted} isMounted={mounted}></Mounter>
        <div className="my-4"></div>
        {mounted && <CharacterFetcher></CharacterFetcher>}
      </div>
    </div>
  );
}
