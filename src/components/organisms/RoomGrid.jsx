import React from "react";
import RoomStatusCard from "@/components/molecules/RoomStatusCard";

const RoomGrid = ({ rooms, onStatusChange, onViewDetails }) => {
  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});

  const sortedFloors = Object.keys(groupedRooms).sort((a, b) => b - a);

  return (
    <div className="space-y-8">
      {sortedFloors.map((floor) => (
        <div key={floor}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Floor {floor}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groupedRooms[floor]
              .sort((a, b) => a.number.localeCompare(b.number))
              .map((room) => (
                <RoomStatusCard
                  key={room.Id}
                  room={room}
                  onStatusChange={onStatusChange}
                  onViewDetails={onViewDetails}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomGrid;