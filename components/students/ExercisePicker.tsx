"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/exercise-categories";
import type { Exercise } from "@/types/exercise";

const MAX_SELECTED = 10;

type ExercisePickerProps = {
  exercises: Exercise[];
};

export function ExercisePicker({ exercises }: ExercisePickerProps) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= MAX_SELECTED) {
        return prev;
      }
      return [...prev, id];
    });
  }

  const grouped = new Map<string, Exercise[]>();
  for (const exercise of exercises) {
    const group = grouped.get(exercise.category) ?? [];
    group.push(exercise);
    grouped.set(exercise.category, group);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-foreground">
        {selected.length}/{MAX_SELECTED} ejercicios seleccionados
      </p>

      <div className="flex max-h-96 flex-col gap-4 overflow-y-auto rounded-md border border-border p-3">
        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category} className="flex flex-col gap-1.5">
            <span
              className={cn(
                "w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
                CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES]
              )}
            >
              {category}
            </span>

            {items.map((exercise) => {
              const checked = selected.includes(exercise.id);
              const disabled = !checked && selected.length >= MAX_SELECTED;

              return (
                <label
                  key={exercise.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                    checked
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-border",
                    disabled && "cursor-not-allowed opacity-40"
                  )}
                >
                  <input
                    type="checkbox"
                    name="exerciseIds"
                    value={exercise.id}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(exercise.id)}
                    className="h-4 w-4 accent-black"
                  />
                  <span>{exercise.title}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
