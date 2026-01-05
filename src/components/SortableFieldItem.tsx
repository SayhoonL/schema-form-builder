import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string;
  label: string;
  type: string;
  selected: boolean;
  onClick: () => void;
};

function SortableFieldItem({
  id,
  label,
  type,
  selected,
  onClick,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`field-item ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
        <strong>{label || "New Field"}</strong>
        <span style={{ marginLeft: "8px" }}>
        {type.toUpperCase()}
        </span>
    </div>
  );
}

export default SortableFieldItem;
