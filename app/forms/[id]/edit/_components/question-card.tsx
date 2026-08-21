'use client'

import type { Question } from "@/app/types";
import { DragHandle } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import QuestionEditContent from "./question-edit-content";
import QuestionViewContent from "./question-view-content";

export default function QuestionCard({
  question,
  index,
  isActive,
  dragHandleProps,
  onClick,
  onUpdate,
  onDelete,
  onDuplicate,
  onOptionChange,
  onAddOption,
  onAddOtherOption,
  onRemoveOption,
}: {
  question: Question;
  index: number;
  isActive: boolean;
  dragHandleProps?: object;
  onClick: () => void;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onOptionChange: (qId: string, optIndex: number, value: string) => void;
  onAddOption: (qId: string) => void;
  onAddOtherOption: (qId: string) => void;
  onRemoveOption: (qId: string, optIndex: number) => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      event.target === event.currentTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Paper
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      data-active={isActive || undefined}
      sx={{
        p: 3,
        borderLeft: "1px solid",
        borderLeftColor: "transparent",
        position: "relative",
        cursor: "pointer",
        "&[data-active]": {
          borderLeftWidth: 6,
          borderLeftColor: "primary.main",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "-2px",
        },
      }}
    >
      <Box
        {...dragHandleProps}
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0,
          cursor: "grab",
          "&:hover": {
            opacity: 1,
          },
          "[data-active] &": {
            opacity: 1,
          },
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DragHandle
          sx={{
            color: "action.active",
          }}
        />
      </Box>

      {isActive ? (
        <QuestionEditContent
          question={question}
          onUpdate={onUpdate}
          onOptionChange={onOptionChange}
          onAddOption={onAddOption}
          onAddOtherOption={onAddOtherOption}
          onRemoveOption={onRemoveOption}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ) : (
        <QuestionViewContent question={question} />
      )}
    </Paper>
  );
}
