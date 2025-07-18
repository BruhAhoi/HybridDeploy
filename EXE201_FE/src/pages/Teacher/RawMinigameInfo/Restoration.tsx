import React, { useState, useEffect } from "react";
import { fetchPlayMinigames, fetchMinigameRating } from "../../../services/authService";
import { Minigame } from "../../../types";
import { baseImageUrl } from "../../../config/base";
import { useParams, useNavigate } from "react-router-dom";

interface RestorationProps {
  onStart: () => void;
}

const Restoration: React.FC<RestorationProps> = ({ onStart }) => {
  /* routing */
  const { minigameId } = useParams<{ minigameId: string }>();
  const navigate = useNavigate();

  /* main data */
  const [minigame, setMinigame] = useState<Minigame | null>(null);
  const [sentences, setSentences] = useState<string[]>([]);
  const [showQ, setShowQ] = useState(false);

  /* ratings */
  const [ratings, setRatings] = useState<
    {
      studentId: string;
      studentName: string;
      minigameId: string;
      score: number;
      comment: string;
      createdDate: string;
    }[]
  >([]);

  /* ---------------- fetch ---------------- */
  useEffect(() => {
    if (!minigameId) return;

    (async () => {
      const data = await fetchPlayMinigames(minigameId);
      if (data) {
        setMinigame(data);
        extractSentences(data.dataText);
      }

      const rgs = await fetchMinigameRating(minigameId);
      if (rgs) setRatings(rgs);
    })();
  }, [minigameId]);

  /* ---------------- parse XML ---------------- */
  const extractSentences = (xml: string) => {
    const dom = new DOMParser().parseFromString(xml, "application/xml");
    const nodes = Array.from(dom.getElementsByTagName("words"));
    const sts = nodes.map((n) => n.textContent?.trim() ?? "").filter(Boolean);
    setSentences(sts);
  };

  /* ---------------- render ---------------- */
  if (!minigame) return <div>Loading...</div>;

  return (
    <div className="min-h-screen font-sans mt-30">
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-blue-200 rounded-xl shadow-md">
        {/* ===== Top card ===== */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* thumbnail */}
          <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            {minigame.thumbnailImage ? (
              <img
                src={baseImageUrl + minigame.thumbnailImage}
                alt="Thumbnail"
                className="object-cover w-full h-full rounded-lg"
              />
            ) : (
              <span>No Image</span>
            )}
          </div>

          {/* info */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">Teacher:</span> {minigame.teacherName}
            </p>
            <h1 className="text-xl font-bold">{minigame.minigameName}</h1>

            <div className="flex items-center gap-2 mt-1 text-yellow-600">
              <span className="font-semibold">{minigame.ratingScore ?? 5.0}</span>
              <span className="text-sm text-gray-500">
                ({ratings.length} {ratings.length === 1 ? "vote" : "votes"})
              </span>
            </div>

            <div className="text-sm text-gray-600 mt-1">
              {sentences.length} sentences • {minigame.duration} sec duration
            </div>

            <div className="mt-3 flex gap-3">
              <button
                className="bg-yellow-400 hover:bg-yellow-300 px-5 py-2 rounded-full font-semibold shadow"
                onClick={onStart}
              >
                Play and edit now
              </button>
              <button
                className="bg-blue-400 hover:bg-blue-300 px-5 py-2 rounded-full font-semibold shadow"
                onClick={() => navigate(`/teacher/minigame-data/${minigameId}`)}
              >
                View minigame data
              </button>
            </div>
          </div>
        </div>

        {/* ===== toggle & sentences ===== */}
        <div className="mt-6">
          <div className="flex items-center mt-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showQ}
                onChange={() => setShowQ(!showQ)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400 transition-all duration-300" />
              <span className="ml-3 text-sm font-medium text-gray-700 select-none">
                Show sentences
              </span>
            </label>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4 transition-opacity duration-300 ${
              showQ ? "opacity-100" : "opacity-5 pointer-events-none select-none"
            }`}
          >
            {sentences.map((s, idx) => (
              <div key={idx} className="bg-gray-100 rounded-lg p-3 shadow-sm font-medium">
                {idx + 1}. {s}
              </div>
            ))}
          </div>
        </div>

        {/* ===== ratings ===== */}
        {ratings.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
            {ratings.map((rating, idx) => (
              <div key={idx} className="border-t pt-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    {rating.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{rating.studentName}</p>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      {"★".repeat(rating.score)}
                      {"☆".repeat(5 - rating.score)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(rating.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{rating.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restoration;
