import React from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

interface KeywordDragDropProps {
  keywords: string[];
  targets: string[];
  onDrop: (targetIndex: number, keyword: string) => void;
  droppedKeywords: { [index: number]: string | null };
  disabled?: boolean;
}

const DraggableKeyword = ({ id, disabled }: { id: string; disabled?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled, // ✅ ngăn kéo thả nếu đang disable
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    padding: "8px 16px",
    backgroundColor: disabled ? "#ddd" : "#c4f5ff",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "grab",
    margin: "4px",
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...(disabled ? {} : listeners)} {...(disabled ? {} : attributes)}>
      {id}
    </div>
  );
};

const DroppableArea = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style: React.CSSProperties = {
    border: "2px dashed #999",
    backgroundColor: isOver ? "#f0fff0" : "white",
    minHeight: "40px",
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    textAlign: "center",
  };

  return <div ref={setNodeRef} style={style}>{children}</div>;
};

const KeywordDragDrop: React.FC<KeywordDragDropProps> = ({
  keywords,
  targets,
  onDrop,
  droppedKeywords,
  disabled = false,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return; // ✅ ngăn drop nếu bị disable

    const { over, active } = event;
    if (over) {
      const targetIndex = parseInt(over.id as string);
      onDrop(targetIndex, active.id as string);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {/* Draggables */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {keywords.map((word) => (
          <DraggableKeyword key={word} id={word} disabled={disabled} />
        ))}
      </div>

      {/* Drop targets */}
      <div className="grid gap-4">
        {targets.map((target, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-32">{target}</div>
            <DroppableArea id={index.toString()}>
              {droppedKeywords[index] || "Drop keyword here"}
            </DroppableArea>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default KeywordDragDrop;
