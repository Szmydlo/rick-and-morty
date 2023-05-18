import Image from "next/image";
import React from "react";
import { TCharacter } from "@/components/CharacterFetcher";

type TProps = {
  characterData: TCharacter;
  loading: boolean;
  error: boolean;
};
const DataDisplay = ({ characterData, loading, error }: TProps) => {
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
  return <>{dataComponent}</>;
};

export default DataDisplay;
