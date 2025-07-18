import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UpdateTrueFalse } from "../../../services/authService";

type TFEntry = { statement: string; answer: boolean };

interface EditTrueFalseProps {
  initialActivityName: string;
  initialDuration: number;
  initialItems: TFEntry[];           // ⬅️  danh sách câu ban đầu
  initialThumbnailUrl: string | null;
  onSave: (d: {
    activityName: string;
    duration: number;
    items: TFEntry[];
    thumbnailUrl: string | null;
  }) => void;
}

/* Chuyển URL tuyệt đối → relative (server expect) */
const getRelative = (url: string | null) => {
  if (!url) return null;
  return url.startsWith("http") ? url.replace(/^.*\/images\//, "") : url;
};

const EditTrueFalse: React.FC<EditTrueFalseProps> = ({
  initialActivityName,
  initialDuration,
  initialItems,
  initialThumbnailUrl,
  onSave,
}) => {
  const teacherId = useSelector((s: RootState) => s.user.userId);
  const { minigameId } = useParams<{ minigameId: string }>();

  /* ───── state ───── */
  const [isOpen, setIsOpen]     = useState(false);
  const [activityName, setActivityName] = useState(initialActivityName);
  const [duration, setDuration] = useState(initialDuration);
  const [items, setItems]       = useState<TFEntry[]>(initialItems);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialThumbnailUrl);

  /* ───── helpers ───── */
  const resetForm = () => {
    setActivityName(initialActivityName);
    setDuration(initialDuration);
    setItems(initialItems);
    setImageFile(null);
    setPreviewUrl(initialThumbnailUrl);
  };

  /* CRUD trên danh sách TFEntry */
  const addItem      = () => setItems(p => [...p, { statement: "", answer: true }]);
  const changeStmt   = (i: number, v: string)  => setItems(p => p.map((e, idx) => idx === i ? { ...e, statement: v } : e));
  const toggleAnswer = (i: number)             => setItems(p => p.map((e, idx) => idx === i ? { ...e, answer: !e.answer } : e));
  const removeItem   = (i: number)             => setItems(p => p.filter((_, idx) => idx !== i));

  const chooseFile = (f: File | null) => {
    setImageFile(f);
    if (f) setPreviewUrl(URL.createObjectURL(f));
    else   setPreviewUrl(initialThumbnailUrl);
  };

  /* Thu hồi blob khi component unmount hoặc file đổi */
  useEffect(() => () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  /* ───── submit ───── */
  const submit = async () => {
    if (!minigameId || !teacherId) return toast.error("Thiếu MinigameId hoặc TeacherId");

    const payload = {
      MinigameId:  minigameId,
      MinigameName: activityName.trim(),
      Duration:    duration,
      TeacherId:   teacherId,
      ImageFile:   imageFile ?? null,
      ImageUrl:    initialThumbnailUrl,
      GameData:    items.map(({ statement, answer }) => ({
        Statement: [statement.trim()],
        Answer:    answer,
      })),
    } as const;

    console.log("TF Payload", payload);

    const ok = await UpdateTrueFalse(payload);
    if (ok) {
      onSave({
        activityName: activityName.trim(),
        duration,
        items,
        thumbnailUrl: imageFile ? null : getRelative(previewUrl),
      });
      toast.success("Cập nhật thành công");
      setIsOpen(false);
    } else {
      toast.error("Cập nhật thất bại. Vui lòng thử lại");
    }
  };

  /* ───── render ───── */
  return (
    <>
      <button
        onClick={() => { resetForm(); setIsOpen(true); }}
        className="px-4 py-2 rounded bg-blue-400 hover:bg-blue-500 text-white font-semibold"
      >
        ✏️ Edit True/False
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg bg-white p-6 border shadow-lg space-y-4">
            <DialogTitle className="text-xl font-bold text-center">
              Edit True ‑ False
            </DialogTitle>

            {/* Activity name */}
            <input
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="Activity name"
              className="w-full border px-3 py-2 rounded"
            />

            {/* Thumbnail + duration */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => chooseFile(e.target.files?.[0] || null)}
                  className="w-full border px-2 py-1 rounded"
                />
                {previewUrl && (
                  <img
                    src={previewUrl ?? undefined}
                    alt="thumbnail preview"
                    className="mt-2 h-24 object-cover rounded shadow"
                  />
                )}
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Duration (sec)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            </div>

            {/* True‑False items */}
            <div>
              <label className="font-semibold">Statements</label>
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 my-2">
                  <input
                    value={item.statement}
                    onChange={(e) => changeStmt(idx, e.target.value)}
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Statement"
                  />
                  <button
                    onClick={() => toggleAnswer(idx)}
                    className={
                      "px-3 py-1 rounded text-white " +
                      (item.answer ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600")
                    }
                    title="Toggle True / False"
                  >
                    {item.answer ? "True" : "False"}
                  </button>
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    🗑
                  </button>
                </div>
              ))}
              <button
                onClick={addItem}
                className="mt-2 bg-blue-100 hover:bg-blue-200 text-black px-3 py-1 rounded"
              >
                ➕ Add statement
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
              >
                ✅ Finish
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default EditTrueFalse;
