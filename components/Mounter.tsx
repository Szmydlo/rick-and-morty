import React, { Dispatch, FormEvent, SetStateAction } from "react";

const Mounter = ({
  setter,
  isMounted,
}: {
  setter: Dispatch<SetStateAction<boolean>>;
  isMounted: boolean;
}) => {
  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    setter(e.currentTarget.checked);
  };
  return (
    <div className="border border-cyan-400 leading-10 pl-4">
      <label>
        <input type="checkbox" onChange={handleOnChange} checked={isMounted} />{" "}
        Mount the search bar
      </label>
    </div>
  );
};

export default Mounter;
