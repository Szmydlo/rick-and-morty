import React, { FormEvent, useEffect, useState } from "react";
import {
  fetchPerson,
  isInCache,
  removeFromCache,
  sortById,
} from "@/utils/fetchUtils";

import CacheButton from "./CacheButton";
import Image from "next/image";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface ICharacter {
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
  const [controller, setController] = useState<AbortController | null>(null);

  const [characterStorage, setCharacterStorage] = useLocalStorage<ICharacter[]>(
    "characters",
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    setController(controller);
    return () => controller.abort();
  }, []);

  const getFromCache = (id: number) => {
    return characterStorage?.find((elem) => elem.id === id);
  };

  const handleOnImageClick = (id: number) => {
    setCurrentValue(id);
    setCharacterData(getFromCache(id)!);
  };

  const handleClearCache = () => {
    setCharacterStorage([]);
    setCurrentValue(0);
    setCharacterData(null);
  };

  const handleClearOneFromCache = () => {
    const aa = removeFromCache(currentValue, characterStorage);
    console.log("aa", aa);
    setCharacterStorage(aa);
    setCurrentValue(0);
    setCharacterData(null);
  };

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) setCharacterData(null);
    setCurrentValue(+e.currentTarget.value);
    const dataFromCache = getFromCache(+e.currentTarget.value);
    if (dataFromCache) setCharacterData(dataFromCache);
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
    if (isInCache(currentValue, characterStorage)) {
      setCharacterStorage((prev) => removeFromCache(currentValue, prev));
    }
    getData(currentValue);
  };

  const getData = async (id: number) => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchPerson(id, controller!);
      console.log("fetch", characterStorage, data);
      setCharacterData(data);
      setLoading(false);
      setCharacterStorage((prev) => sortById([...prev!, data]));
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
          className="bg-cyan-400 text-black w-16 leading-8 rounded-md mx-2 disabled:bg-cyan-800"
          disabled={loading || !currentValue}
        >
          {isInCache(currentValue, characterStorage) ? "Refetch" : "Fetch"}
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
      <div className="my-2" />
      <div>
        <button
          className="text-cyan-400 text-[12px] block h-[16px]"
          onClick={handleClearOneFromCache}
        >
          {characterData
            ? `Remove '${characterData.name}' (#${characterData.id}) from cache?`
            : ""}
        </button>
        <button
          className="text-cyan-400 text-[12px] block h-[16px]"
          onClick={handleClearCache}
        >
          Clear cache?
        </button>
        <div className="flex">
          {characterStorage &&
            characterStorage.map((character, id) => (
              <CacheButton
                key={id}
                imageUrl={character.image}
                name={character.name}
                chosen={character.id === currentValue}
                onImageClick={() => handleOnImageClick(character.id)}
              ></CacheButton>
            ))}
        </div>
      </div>
    </>
  );
};

export default CharacterFetcher;
