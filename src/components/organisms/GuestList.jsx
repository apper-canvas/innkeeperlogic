import React from "react";
import GuestCard from "@/components/molecules/GuestCard";

const GuestList = ({ guests, onViewProfile, onEditGuest }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {guests.map((guest) => (
        <GuestCard
          key={guest.Id}
          guest={guest}
          onViewProfile={onViewProfile}
          onEditGuest={onEditGuest}
        />
      ))}
    </div>
  );
};

export default GuestList;