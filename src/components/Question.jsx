import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export default function Question({ question, onAnswer, answer }) {
  const { type, text, options, rows, columns, required } = question;

  switch (type) {
    case "single_choice":
      return (
        <fieldset className="mb-4">
          <legend className="font-semibold">{text} {required && "*"}</legend>
          {options.map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={question.id}
                value={opt}
                checked={answer === opt}
                onChange={() => onAnswer(question.id, opt)}
                required={required}
              />
              {" "}{opt}
            </label>
          ))}
        </fieldset>
      );

    case "multiple_choice":
      return (
        <fieldset className="mb-4">
          <legend className="font-semibold">{text} {required && "*"}</legend>
          {options.map((opt) => (
            <label key={opt} className="block">
              <input
                type="checkbox"
                name={question.id}
                value={opt}
                checked={Array.isArray(answer) && answer.includes(opt)}
                onChange={(e) => {
                  let newVal = Array.isArray(answer) ? [...answer] : [];
                  if (e.target.checked) newVal.push(opt);
                  else newVal = newVal.filter((v) => v !== opt);
                  onAnswer(question.id, newVal);
                }}
              />
              {" "}{opt}
            </label>
          ))}
        </fieldset>
      );

    case "ranking":
      return <RankingQuestion text={text} options={options} answer={answer} onAnswer={(val) => onAnswer(question.id, val)} />;

    case "matrix":
      return (
        <MatrixQuestion
          rows={rows}
          columns={columns}
          answer={answer || {}}
          onAnswer={(row, col) => {
            onAnswer(question.id, { ...answer, [row]: col });
          }}
        />
      );

    case "number":
      return (
        <div className="mb-4">
          <label className="font-semibold block mb-1">
            {text} {required && "*"}
            <input
              type="number"
              value={answer || ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="border rounded w-full p-1 mt-1"
              required={required}
            />
          </label>
        </div>
      );

    case "date":
      return (
        <div className="mb-4">
          <label className="font-semibold block mb-1">
            {text} {required && "*"}
            <input
              type="date"
              value={answer || ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="border rounded w-full p-1 mt-1"
              required={required}
            />
          </label>
        </div>
      );

    case "text":
      return (
        <div className="mb-4">
          <label className="font-semibold block mb-1">
            {text} {required && "*"}
            <textarea
              value={answer || ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="border rounded w-full p-1 mt-1"
              rows={4}
              required={required}
            />
          </label>
        </div>
      );

    default:
      return <div>Unbekannter Fragetyp: {type}</div>;
  }
}

// Drag & Drop Ranking Komponente
function RankingQuestion({ text, options, answer, onAnswer }) {
  const [items, setItems] = useState(answer || options);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newItems = [...items];
      newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, active.id);
      setItems(newItems);
      onAnswer(newItems);
    }
  };

  return (
    <div className="mb-4">
      <p className="font-semibold mb-2">{text}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    padding: "8px",
    border: "1px solid #ccc",
    marginBottom: "4px",
    backgroundColor: "white",
    cursor: "grab",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}

// Matrix-Frage Komponente
function MatrixQuestion({ rows, columns, answer, onAnswer }) {
  return (
    <div className="mb-4 overflow-auto">
      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th></th>
            {columns.map((col) => (
              <th
                key={col}
                className="border border-gray-400 px-2 py-1 text-center"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className="border border-gray-400 px-2 py-1 font-semibold">
                {row}
              </td>
              {columns.map((col) => (
                <td
                  key={col}
                  className="border border-gray-400 text-center"
                >
                  <input
                    type="radio"
                    name={`${row}-matrix`}
                    checked={answer[row] === col}
                    onChange={() => onAnswer(row, col)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
