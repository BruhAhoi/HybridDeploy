import React, { useState, useEffect } from "react";
import {RandomCardItem} from "../../../types/index";
import { motion, AnimatePresence } from "framer-motion";
import cardBack from "../../../assets/card-back.jpg";
import Header from "../../../components/HomePage/Header";
import Footer from "../../../components/HomePage/Footer";
import { fetchPlayMinigames } from "../../../services/authService";
import { useParams } from "react-router-dom";
import { baseImageUrl } from "../../../config/base";

const PlayRandomCard : React.FC = () => {
    const [deck, setDeck] = useState<RandomCardItem[]>([]);
    const [currentCard, setCurrentCard] = useState<RandomCardItem | null>(null);
    const [drawnCards, setDrawnCards] = useState<RandomCardItem[]>([]);
    const [drawnIndex, setDrawnIndex] = useState<number>(0);
    const [isSuffling, setIsShuffling] = useState(false);
    const [isUndoing, setIsUndoing] = useState(false);
    const { minigameId } = useParams();

    const handleDrawCard = () => {
        if(deck.length == 0)
            return;
        const index = deck.length - 1;
        const selected = deck[index];
        setDrawnIndex(index);
        setCurrentCard(selected);
        setDrawnCards(prev => [...prev, selected]); 
        setTimeout(() => {
            setDeck(prev => prev.filter((_, i) => i !== index));
            setDrawnIndex(0)
        }, 500);
    }

    const handleSuffleDeck = () => {
        setIsShuffling(true);
        setTimeout(() => {
            const combine = [...deck, ...drawnCards];
            const shuffledDeck = combine.sort(() => Math.random() - 0.5);
            setDeck(shuffledDeck);
            setDrawnCards([]);
            setCurrentCard(null);
            setIsShuffling(false);
        },600);

    }

    const handleUndo = () => {
        if(drawnCards.length === 0)
            return;
        setIsUndoing(true);
        setTimeout(() => {
            const lastCard = drawnCards[drawnCards.length - 1];
            setDrawnCards(prev => prev.slice(0, -1));
            setDeck(prev => [lastCard, ...prev]);
            setCurrentCard(null);
            setIsUndoing(false);
        }, 400);
    }
    useEffect(() => {
        const fetchData = async () => {
            if (!minigameId) return;
            const data = await fetchPlayMinigames(minigameId);
            
            console.log("response", data);
            if (data?.dataText) {
                const parser = new DOMParser();
                const xml = parser.parseFromString(data.dataText, "text/xml");
                const questions = await Promise.all(
                    Array.from(xml.getElementsByTagName("question")).map(async (q) => {
                        const text = q.getElementsByTagName("text")[0]?.textContent?.trim() || "";
                        const imageURL = q.getElementsByTagName("image")[0]?.textContent?.trim() || "";
                        const finalUrl = baseImageUrl + imageURL;
                        try {
                            const response = await fetch(finalUrl);
                            const blob = await response.blob();
                            const file = new File([blob], "image.jpg", { type: blob.type });
                            return { Text: text, Image: file } as RandomCardItem;
                        } catch (error) {
                            console.error("Image fetch failed", error);
                            return { Text: text, Image: null } as RandomCardItem;
                        }
                    })
                );
                setDeck(questions);
            }
        };
        fetchData();
    }, [minigameId]);


    return (
        <>
        <Header/>
        <div className="w-[900px] mt-25 mb-55 mx-auto flex flex-col items-center gap-6">
            <div className="flex border bg-green-300 p-8 rounded-md justify-center items-center gap-10 w-full">
                <motion.div 
                    className="relative w-40 h-56 cursor-pointer " 
                    onClick={handleDrawCard}
                    animate= {isSuffling ? { rotate: [0 ,10, -10, 0] } : {}}
                    transition={{ duration: 0.6 }}>
                    {deck.slice(-5).map((_, i, arr) => {
                        const globalIndex = deck.length - arr.length + i;
                        const isDrawing = globalIndex === drawnIndex;
                        return (
                            <motion.img
                            key={globalIndex}
                            src={cardBack}
                            initial={{ opacity: 1, y: 0 }}
                            animate={{
                                opacity: isDrawing ? 0 : 1,
                                y: isDrawing ? -40 : 0,
                                scale: isDrawing ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                            className="absolute w-full h-full rounded-md shadow-lg"
                            style={{ top: i * 2, left: i * 2, zIndex: i }}
                            />
                        );
                    })}
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-bold">
                        Draw
                    </div>
                </motion.div>

                <AnimatePresence>
                    {currentCard && (
                        <motion.div
                           key={currentCard.Text}
                           initial ={isUndoing ? {opacity: 1, x: 0} : {opacity: 0, y: -20}}
                           animate ={isUndoing ? {opacity: 1, y: 0} : {opacity: 1, y: 0}}
                           transition={{ duration: 0.5 }}
                           exit={{ opacity: 0 }}
                           className="w-40 h-56 bg-white border-4 border-red-400 rounded-md p-3 shadow-lg flex flex-col items-center justify-center"
                        >
                            {currentCard.Image ? (
                                <img
                                    src={URL.createObjectURL(currentCard.Image)}
                                    alt={currentCard.Text}
                                    className="h-24 mb-2 object-contain"
                                />
                            ) : (
                                <div className="h-24 mb-2 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                            <p className="text-center font-semibold text-lg">{currentCard.Text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex gap-6">
                <motion.button
                    onClick={handleSuffleDeck}
                    whileTap={{scale: 0.9, rotate: -10}}
                    className="bg-yellow-300 hover:bg-yellow-500 px-4 py-2 rounded shadow text-black font-semibold">
                        Shuffle
                </motion.button>
                <motion.button
                    onClick={handleUndo}
                    whileTap={{scale: 1.1, x: -10}}
                    className="bg-gray-300 hover:bg-gray-500 px-4 py-2 rounded shadow text-white font-semibold">
                        Undo
                </motion.button>
                <motion.button
                    onClick={handleDrawCard}
                    whileTap={{scale: 1.1}}
                    className="bg-blue-400 hover:bg-blue-600 px-4 py-2 rounded shadow text-white font-semibold">
                        Draw
                </motion.button>
            </div>
        </div>
        <Footer/>
        </>
    )
}
export default PlayRandomCard