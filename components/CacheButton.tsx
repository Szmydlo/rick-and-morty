import Image from "next/image";
import React from "react";

type TProps = {
  imageUrl: string;
  name: string;
  chosen: boolean;
  onImageClick: () => void;
};
const CacheButton = ({ imageUrl, name, chosen, onImageClick }: TProps) => {
  return (
    <div
      className={`m-2 rounded-md  border-2  ${
        chosen
          ? "opacity-30 border-cyan-400 border-2 border-solid"
          : "opacity-100 border-transparent hover:border-cyan-400 hover:border-2 hover:cursor-pointer"
      }`}
    >
      <Image
        className="rounded-md"
        src={imageUrl}
        alt=""
        width={25}
        height={25}
        title={name}
        onClick={onImageClick}
      />
    </div>
  );
};

export default CacheButton;
