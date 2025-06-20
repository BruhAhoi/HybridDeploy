import React from "react";

interface CourseCardProps {
  courseName: string;
  levelName: string;
  thumbnail?: string;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseName,
  levelName,
  thumbnail = "/placeholder-image.jpg",
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-pink-50 p-4 rounded-xl shadow-md text-center w-[200px] h-[250px] cursor-pointer"
  >
    <img
      src={encodeURI(thumbnail)}
      alt={`${courseName} thumbnail`}
      className="w-full h-[120px] object-cover rounded-md mb-2"
    />
    <h3 className="text-lg font-semibold">{courseName}</h3>
    <p className="text-sm text-gray-500">{levelName}</p>
  </div>
);

export default CourseCard;
