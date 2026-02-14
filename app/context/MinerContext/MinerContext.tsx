"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MinerContextType {
  selectedId: string;
  setSelectedId: (id: string) => void;
}

const MinerContext = createContext<MinerContextType | undefined>(undefined);

export const MinerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <MinerContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </MinerContext.Provider>
  );
};

export const useMiner = () => {
  const context = useContext(MinerContext);
  if (!context) throw new Error("useMiner must be used within MinerProvider");
  return context;
};
