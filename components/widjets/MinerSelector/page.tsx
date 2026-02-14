"use client";

import React, { useState, useEffect } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { useMiner } from "@/app/context/MinerContext/MinerContext";

interface Miner {
  miner_id: string;
  miner_model: string;
  miner_name: string;
  miner_type: string;
}

interface Option {
  value: string;
  label: string;
}

const MinerSelector: React.FC = () => {
  const { setSelectedId } = useMiner();
  const [miners, setMiners] = useState<Miner[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMiners = async () => {
      try {
        const response = await fetch("/api/all/miner_selector");
        if (!response.ok) throw new Error("Failed to fetch miners");

        const data: Miner[] = await response.json();
        setMiners(data);

        if (data.length > 0) {
          const first = {
            value: data[0].miner_id,
            label: `${data[0].miner_name} ${data[0].miner_model} ${data[0].miner_type}`,
          };
          setSelectedOption(first);
          setSelectedId(first.value);
        }
      } catch (err) {
        setError("Error loading miners");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMiners();
  }, [setSelectedId]);

  const handleChange = (option: SingleValue<Option>) => {
    if (!option) return;
    setSelectedOption(option);
    setSelectedId(option.value);
  };

  if (loading) return <p className="text-2xl">Loading miners...</p>;
  if (error) return <p>{error}</p>;

  const customStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#37323E",
      color: "#DE9E36",
      fontSize: "1.25rem",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#6D6A75",
      width: "20vw",
      left: 0,
      borderRadius: 1,
      marginTop: 0,
      borderWidth: 1,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#DEB841" : "#BFBDC1",
      color: "#37323E",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#BFBDC1",
    }),
  };

  const options: Option[] = miners.map((miner) => ({
    value: miner.miner_id,
    label: `${miner.miner_name} ${miner.miner_model} ${miner.miner_type}`,
  }));

  return (
    <div className="w-96 text-md relative ">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement="bottom"
        isSearchable={false}
      />
    </div>
  );
};

export default MinerSelector;
