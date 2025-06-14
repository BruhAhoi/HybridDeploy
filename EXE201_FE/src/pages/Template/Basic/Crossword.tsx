import React, { useState } from 'react';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Entry {
  answer: string;
  clue: string;
}

const CrosswordEditor: React.FC = () => {
  const [activityName, setActivityName] = useState('');
  const [entries, setEntries] = useState<Entry[]>([
    { answer: '', clue: '' },
    { answer: '', clue: '' },
    { answer: '', clue: '' }
  ]);
  const navigate = useNavigate();

  const handleChange = (index: number, field: keyof Entry, value: string) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const handleAdd = () => {
    setEntries([...entries, { answer: '', clue: '' }]);
  };

  const handleDelete = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= entries.length) return;
    const updated = [...entries];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setEntries(updated);
  };

  const handleFinish = () => {
    navigate('/crossword-review');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-[900px] h-[400px] border rounded-2xl bg-white flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Activity name</h1>
        <input
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 mb-6 w-full max-w-md"
        />

        <div className="w-full max-w-3xl">
            <div className="grid grid-cols-12 font-semibold mb-2 px-2">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Answers</div>
            <div className="col-span-5">Clue</div>
            <div className="col-span-1 text-center">Actions</div>
            </div>

            {entries.map((entry, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2 px-2">
                <div className="col-span-1">{index + 1}.</div>
                <input
                className="col-span-5 border border-gray-300 px-2 py-1 rounded"
                value={entry.answer}
                onChange={(e) => handleChange(index, 'answer', e.target.value)}
                />
                <input
                className="col-span-5 border border-gray-300 px-2 py-1 rounded"
                value={entry.clue}
                onChange={(e) => handleChange(index, 'clue', e.target.value)}
                />
                <div className="col-span-1 flex gap-1 justify-center items-center">
                <button onClick={() => handleMove(index, index - 1)}>
                    <ArrowUp className="w-4 h-4" />
                </button>
                <button onClick={() => handleMove(index, index + 1)}>
                    <ArrowDown className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                </button>
                </div>
            </div>
            ))}
        </div>

        <div className="flex justify-between mt-6 w-full max-w-md">
            <button
            onClick={handleAdd}
            className="bg-yellow-200 hover:bg-yellow-300 px-4 py-2 rounded-md font-medium"
            >
            + Add more
            </button>
            <button
            onClick={handleFinish}
            className="bg-lime-300 hover:bg-lime-400 px-6 py-2 rounded-md font-medium"
            >
            Finish
            </button>
        </div>
        </div>
    </div>
  );
};

export default CrosswordEditor;
