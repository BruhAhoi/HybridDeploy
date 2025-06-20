import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/HomePage/Header";
import Footer from "../../../components/HomePage/Footer";
import { fetchPlayMinigames } from "../../../services/authService";
import EditPairing from "../../Teacher/Template/EditParing";
import { baseImageUrl } from "../../../config/base";
import PairingRaw from "../../Teacher/RawMinigameInfo/Pairing";

type Card = { id: number; word: string; isFlipped: boolean; isMatched: boolean };

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const parseWords = (xml: string): string[] =>
  Array.from(new DOMParser().parseFromString(xml, "application/xml").getElementsByTagName("words")).map(
    (w) => w.textContent?.trim() ?? ""
  );

const getFullThumbUrl = (url: string): string =>
  url.startsWith("http") ? url : baseImageUrl + url;

const getColorClass = (word: string) => {
  const colors: Record<string, string> = {
    Toy: "bg-green-500",
    Summer: "bg-blue-500",
    Winter: "bg-red-500",
    Park: "bg-yellow-600",
    Fall: "bg-orange-500",
    Spring: "bg-purple-500",
  };
  return colors[word] || "bg-gray-500";
};

const PairingReview: React.FC = () => {
  const { minigameId } = useParams<{ minigameId: string }>();

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  const [activityName, setActivityName] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>();

  const [remaining, setRemaining] = useState<number | null>(null);
  const [paused, setPaused] = useState(true);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const originalWords = useMemo(() => [...new Set(cards.map((c) => c.word))], [cards]);

  useEffect(() => {
    if (!minigameId) return;
    (async () => {
      try {
        const data = await fetchPlayMinigames(minigameId);
        setActivityName(data.minigameName);
        setDuration(Number(data.duration));
        setThumbnailUrl(data.thumbnailImage ?? "");

        const words = parseWords(data.dataText ?? "");
        const shuffled = shuffle(words.flatMap((w) => [w, w]));
        const initCards = shuffled.map((w, i) => ({
          id: i,
          word: w,
          isFlipped: false,
          isMatched: false,
        }));
        setCards(initCards);
        setRemaining(Number(data.duration));
      } catch {
        setError("Không tải được minigame.");
      } finally {
        setLoading(false);
      }
    })();
  }, [minigameId]);

  useEffect(() => {
    if (paused || finished || remaining === null || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((t) => (t && t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [paused, remaining, finished]);

  useEffect(() => {
    if (remaining === 0 && !finished && !loading) {
      setPaused(true);
      setFinished(true);
    }
  }, [remaining, finished, loading]);

  useEffect(() => {
    if (flippedCards.length !== 2) return;
    const [a, b] = flippedCards;
    const isMatch = cards[a].word === cards[b].word;

    if (isMatch) {
      setCards((prev) =>
        prev.map((c) => (flippedCards.includes(c.id) ? { ...c, isMatched: true } : c))
      );
      setMatchedPairs((prev) => [...prev, a, b]);
      setFlippedCards([]);
    } else {
      const timeout = setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (flippedCards.includes(c.id) ? { ...c, isFlipped: false } : c))
        );
        setFlippedCards([]);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (!finished && cards.length && matchedPairs.length === cards.length) {
      setPaused(true);
      setFinished(true);
    }
  }, [matchedPairs, cards.length, finished]);

  const handleCardClick = (id: number) => {
    if (paused || finished || flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)));
    setFlippedCards((prev) => [...prev, id]);
  };

  const resetGame = () => {
    const reshuffled = shuffle(cards.map((c) => ({ ...c, isFlipped: false, isMatched: false })))
      .map((c, i) => ({ ...c, id: i }));
    setCards(reshuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setRemaining(duration);
    setPaused(false);
    setFinished(false);
  };

  const handleSaveEdit = (data: {
    activityName: string;
    duration: number;
    words: string[];
    thumbnailUrl: string | null;
  }) => {
    setActivityName(data.activityName);
    setDuration(data.duration);
    setThumbnailUrl(data.thumbnailUrl?.replace(baseImageUrl, "") ?? "");

    const deck = shuffle(data.words.flatMap((w) => [w, w]));
    const newCards = deck.map((w, i) => ({
      id: i,
      word: w,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setRemaining(data.duration);
    setPaused(true);
    setFinished(false);
  };

  const handleSubmit = () => {
    setPaused(true);
    setFinished(true);
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (loading) return <><Header /><div className="min-h-screen flex items-center justify-center">Loading…</div><Footer /></>;
  if (error) return <><Header /><div className="min-h-screen flex items-center justify-center text-red-600">{error}</div><Footer /></>;

  return (
    <>
      <Header />
      {!isPlaying ? (
          <PairingRaw onStart={() => setIsPlaying(true)}/>
      ) : (
      <><div className="min-h-screen flex flex-col items-center bg-white px-4 py-8 mt-20">
            <div className="w-[900px] flex justify-between items-center mb-4">
              <p className={`font-semibold ${(remaining ?? 0) <= 10 ? "text-red-600" : "text-gray-700"}`}>
                ⏰ {formatTime(remaining ?? 0)}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded"
                >
                  {paused ? "Play" : "Pause"}
                </button>
                <EditPairing
                  initialActivityName={activityName}
                  initialDuration={duration}
                  initialWords={originalWords}
                  initialThumbnailUrl={getFullThumbUrl(thumbnailUrl)}
                  onSave={handleSaveEdit} />
              </div>
            </div>

            <div className="w-[900px] min-h-[400px] bg-pink-100 border rounded-lg p-6 mb-10 flex justify-center items-center">
              <div className="grid grid-cols-3 gap-12">
                {cards.map((card) => {
                  const show = card.isFlipped || card.isMatched;
                  const bg = show ? getColorClass(card.word) : "bg-yellow-200";
                  const border = card.isMatched ? "border-green-500" : "border-gray-400";
                  return (
                    <div key={card.id} onClick={() => handleCardClick(card.id)} className="w-28 h-12 perspective">
                      <div className={`card-inner ${show ? "rotate-y-180" : ""}`}>
                        <div className="backface-hidden bg-yellow-200 border border-gray-400 rounded-full w-full h-full" />
                        <div className={`backface-hidden rotate-y-180 ${bg} border ${border} rounded-full flex items-center justify-center text-white text-lg font-medium w-full h-full`}>
                          {card.word}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full max-w-[700px] flex justify-between items-center">
              <button onClick={resetGame} className="px-6 py-2 bg-blue-200 text-blue-800 font-semibold rounded-full hover:bg-blue-300 transition">
                Try again
              </button>
              <button onClick={handleSubmit} className="px-6 py-2 bg-green-200 text-green-800 font-semibold rounded-full hover:bg-green-300 transition">
                Submit
              </button>
            </div>

            {finished && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg text-center space-y-4">
                  <h2 className="text-xl font-bold">Game Over</h2>
                  <p>
                    You matched <span className="font-semibold">{matchedPairs.length / 2}</span> / {cards.length / 2} pairs
                  </p>
                  <button onClick={resetGame} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Play again
                  </button>
                </div>
              </div>
            )}
          </div><Footer /></>
)}
    </>
  );
};

export default PairingReview;
