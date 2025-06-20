import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPlayMinigames } from '../../services/authService';
import { Flashcard } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/HomePage/Header';
import EditFlashcard from '../Teacher/Template/EditFlashcard';
import { baseImageUrl } from '../../config/base';
import FlashcardRaw from '../Teacher/RawMinigameInfo/Flashcard';

const FlashcardReview: React.FC = () => {
  const { minigameId } = useParams<{ minigameId: string }>();
  const [flipped, setFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activityName, setActivityName] = useState("");
  const [duration, setDuration] = useState(60);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        if (!minigameId) return;

        const data = await fetchPlayMinigames(minigameId);
        setActivityName(data.minigameName);
        setDuration(data.duration);
        setThumbnailUrl(data.thumbnailImage ? `${baseImageUrl}${data.thumbnailImage}` : null);
        const raw = data.dataText as string;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(raw, 'application/xml');
        const questionNodes = Array.from(xmlDoc.getElementsByTagName('question'));

        const parsedFlashcards: Flashcard[] = questionNodes.map((node, index) => {
          const front = node.getElementsByTagName('front')[0]?.textContent || '';
          const back = node.getElementsByTagName('back')[0]?.textContent || '';
          return { id: index + 1, front, back };
        });

        setFlashcards(parsedFlashcards);
      } catch (err) {
        console.error('Error fetching flashcards', err);
      }
    };

    loadFlashcards();
  }, [minigameId]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };
  const handleSave = (updated: {
    activityName: string;
    duration: number;
    pairs: { front: string; back: string }[];
    thumbnail: File | null;
  }) => {
    setActivityName(updated.activityName);
    setDuration(updated.duration);
    setFlashcards(
      updated.pairs.map((p, i) => ({ id: i + 1, front: p.front, back: p.back }))
    );
    // Nếu muốn cập nhật thumbnail preview, bạn có thể setThumbnailUrl(URL.createObjectURL(updated.thumbnail!))
  };


  return (
    <>
      <Header />
      {!isPlaying ? (
        <FlashcardRaw onStart={() => setIsPlaying(true)} />
      ) :
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Xem lại Flashcard</h1>

          <div className="mb-4">
            <EditFlashcard
              initialActivityName={activityName}
              initialDuration={duration}
              initialThumbnailUrl={thumbnailUrl}
              initialPairs={flashcards.map(({ front, back }) => ({ front, back }))}
              onSave={handleSave}
            />
          </div>

          {flashcards.length > 0 ? (
            <div className="flex items-center space-x-6">
              <button onClick={handlePrev} className="text-gray-700 hover:text-black">
                <ChevronLeft size={40} />
              </button>

              <div className="card-container" onClick={handleFlip}>
                <div className={`card-inner ${flipped ? "flipped" : ""}`}>
                  <div className="card-front">
                    {flashcards[currentIndex].front}
                  </div>
                  <div className="card-back">
                    {flashcards[currentIndex].back}
                  </div>
                </div>
              </div>

              <button onClick={handleNext} className="text-gray-700 hover:text-black">
                <ChevronRight size={40} />
              </button>
            </div>
          ) : (
            <p className="text-gray-500 mt-8">Chưa có flashcard nào để xem.</p>
          )}

        </div>
      }
    </>
  );
};

export default FlashcardReview;
