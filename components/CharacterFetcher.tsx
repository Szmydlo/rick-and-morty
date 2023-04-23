import React, { FormEvent, useEffect, useState } from "react";

import Image from "next/image";
import { fetchPerson } from "@/utils/fetchUtils";

interface ICharacter {
  image: string;
  gender: string;
  origin: { name: string };
  status: string;
  species: string;
  name: string;
  location: { name: string };
  id: number;
}

const CharacterFetcher = () => {
  const [currentValue, setCurrentValue] = useState(0);
  const [characterData, setCharacterData] = useState<ICharacter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastFetchedValue, setLastFetchedValue] = useState<number | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setController(controller);
    return () => controller.abort();
  }, []);

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    setCurrentValue(+e.currentTarget.value);
  };
  const handleRandomFetchCharacter = () => {
    let id = -1;
    do {
      id = Math.floor(Math.random() * 826 + 1);
    } while (id === currentValue);
    setCurrentValue(id);
    getData(id);
  };
  const handleFetchCharacter = () => {
    getData(currentValue);
  };

  const getData = async (id: number) => {
    setLastFetchedValue(id);
    setLoading(true);
    setError(false);
    try {
      const data = await fetchPerson(id, controller!);
      console.log(data);
      setCharacterData(data);
      setLoading(false);
    } catch (e) {
      console.log("inside catch");
      setLoading(false);
      setError(true);
    }
  };

  let dataComponent = (
    <div className="h-[100px] flex">
      <div className="w-[100px] border rounded-[15px] border-cyan-400 border-dotted mr-4"></div>
      <div className="flex-col flex">
        <div className="h-[30%] text-[24px] mb-2">???</div>
        <div></div>
      </div>
    </div>
  );

  if (characterData) {
    dataComponent = (
      <div className="h-[100px] flex">
        <div className="w-[100px] border rounded-[15px] border-cyan-400 border-dotted mr-4">
          <Image
            src={characterData.image}
            alt=""
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
        <div className="flex-col flex">
          <div className="h-[30%] text-[24px] mb-2">{characterData.name}</div>
          <span className="text-[12px]">{`#${characterData.id}, ${characterData.status}, ${characterData.species}, ${characterData.gender}`}</span>
          <span className="text-[12px]">{`origin: ${characterData.origin.name}`}</span>
          <span className="text-[12px]">{`location: ${characterData.location.name}`}</span>
        </div>
      </div>
    );
  }

  if (loading) {
    dataComponent = (
      <div className="h-[100px] flex">
        <div className="w-[100px] border rounded-[15px] border-cyan-400 border-dotted mr-4"></div>
        <div className="flex-col flex">
          <div className="h-[30%] text-[24px] mb-2">Fetching info</div>
          <div></div>
        </div>
      </div>
    );
  }

  if (error) {
    dataComponent = (
      <div className="h-[100px] flex">
        <div className="w-[100px] border rounded-[15px] border-red-400 border-dotted mr-4"></div>
        <div className="flex-col flex text-red-400">
          <div className="h-[30%] text-[24px] mb-2 ">Error</div>
          <span className="text-[12px]">No such character</span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="mb-4">
        <input
          className="bg-slate-700 w-[80%] disabled:bg-slate-900"
          type="number"
          min={1}
          step={1}
          placeholder="Pick a number"
          pattern="^[0-9]"
          onChange={handleInputChange}
          value={currentValue ? currentValue : ""}
          disabled={loading}
        />
        <button
          onClick={handleFetchCharacter}
          className="bg-cyan-400 text-black w-14 leading-8 rounded-md mx-2 disabled:bg-cyan-800"
          disabled={loading || lastFetchedValue === currentValue}
        >
          Fetch
        </button>
        <button
          onClick={handleRandomFetchCharacter}
          className="bg-yellow-200 text-black w-16 rounded-md leading-8 disabled:bg-yellow-800"
          disabled={loading}
        >
          Random
        </button>
        <span className="text-[12px]">Which Rick and Morty Character?</span>
      </div>
      {dataComponent}
    </>
  );
};

export default CharacterFetcher;
