import React, { FormEvent, useEffect, useState } from "react";
import {
  fetchPerson,
  isInCache,
  removeFromCache,
  sortById,
} from "@/utils/fetchUtils";

import CacheButton from "./CacheButton";
import CharacterInput from "./CharacterInput";
import DataDisplay from "./DataDisplay";
import Image from "next/image";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type TCharacter = {
  image: string;
  gender: string;
  origin: { name: string };
  status: string;
  species: string;
  name: string;
  location: { name: string };
  id: number;
};

const CharacterFetcher = () => {
  const [currentValue, setCurrentValue] = useState(0);
  const [characterData, setCharacterData] = useState<TCharacter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const [characterStorage, setCharacterStorage] = useLocalStorage<TCharacter[]>(
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
    setCharacterStorage(removeFromCache(currentValue, characterStorage));
    setCurrentValue(0);
    setCharacterData(null);
  };

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) setCharacterData(null);
    setCurrentValue(+e.currentTarget.value);
    const dataFromCache = getFromCache(+e.currentTarget.value);
    if (dataFromCache) setCharacterData(dataFromCache);
    else setCharacterData(null);
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
      setCharacterData(data);
      setLoading(false);
      setCharacterStorage((prev) => sortById([...prev!, data]));
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  const inputProps = {
    handleInputChange,
    handleFetchCharacter,
    handleRandomFetchCharacter,
    currentValue,
    loading,
    characterStorage: characterStorage ? characterStorage : [],
  };
  return (
    <>
      <CharacterInput {...inputProps} />
      <DataDisplay
        characterData={characterData!}
        loading={loading}
        error={error}
      />
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
