import React from "react";
import { Criminales } from "../../pages/Criminales";
import { CriminalCard } from "../Records/CriminalCard";

interface ChooseDatabaseProps {
  isCriminalSelected: boolean;
  handleVerClick: () => void;
  handleVerClickFalse: () => void;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  handleComplete: () => void;
  handleReload: () => void;
}

export const ChooseDatabase: React.FC<ChooseDatabaseProps> = ({
  isCriminalSelected,
  handleVerClick,
  handleVerClickFalse,
  setSelectedImage,
  handleComplete,
  handleReload,
}) => {
  return (
    <div>
      {!isCriminalSelected ? (
        <Criminales
          search={true}
          onVerClick={handleVerClick}
          handleReload={handleReload}
        ></Criminales>
      ) : (
        <CriminalCard
          search={true}
          onVerClickFalse={handleVerClickFalse}
          setSelectedImage={setSelectedImage}
          handleComplete={handleComplete}
        ></CriminalCard>
      )}
    </div>
  );
};
