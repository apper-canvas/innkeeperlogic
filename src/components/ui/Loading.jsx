import React from "react";
import Card from "@/components/atoms/Card";

const Loading = ({ type = "cards" }) => {
  const CardSkeleton = () => (
    <Card className="p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex space-x-2 mt-4">
        <div className="h-8 bg-gray-300 rounded flex-1"></div>
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
      </div>
    </Card>
  );

  const StatSkeleton = () => (
    <Card className="p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </Card>
  );

  const TableSkeleton = () => (
    <Card className="overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-300 rounded w-48"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (type === "table") {
    return <TableSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Loading;