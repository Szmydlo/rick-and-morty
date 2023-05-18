import React, { FormEvent } from "react";

import { TCharacter } from "./CharacterFetcher";
import { isInCache } from "@/utils/fetchUtils";

type TProps = {
  handleInputChange: (e: FormEvent<HTMLInputElement>) => void;
  handleFetchCharacter: () => void;
  handleRandomFetchCharacter: () => void;
  currentValue: number;
  loading: boolean;
  characterStorage: TCharacter[];
};

const CharacterInput = ({
  handleInputChange,
  handleFetchCharacter,
  handleRandomFetchCharacter,
  currentValue,
  loading,
  characterStorage,
}: TProps) => {
  return (
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
  );
};

export default CharacterInput;
