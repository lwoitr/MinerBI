const LastaManalCheck = () => {
  return (
    <div className="flex flex-col shadow-[#6D6A75] shadow-md">
      <div className="flex bg-[#6D6A75] gap-1 text-[#BFBDC1] px-6 py-2 font-medium">
        <h3>
          Last manual check performed:
          <em> at mm/dd/yyyy timestamp by name see full report </em>
        </h3>
        <a href="#logs-table" className="underline text-[#BFBDC1] italic">
          here
        </a>
      </div>
      <div className="px-6 py-1 bg-[#BFBDC1] text-sm">
        <h3 className=" text-[#37323E] italic">notes:</h3>
      </div>
    </div>
  );
};
export default LastaManalCheck;
