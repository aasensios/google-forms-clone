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
  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 3,
        borderLeft: isActive ? "6px solid" : "1px solid",
        borderLeftColor: isActive ? "primary.main" : "transparent",
        position: "relative",
      }}
    >
      <Box
        {...dragHandleProps}
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: isActive ? 1 : 0,
          cursor: "grab",
          "&:hover": {
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
        <QuestionViewContent
          question={question}
          onClick={onClick}
        />
      )}
    </Paper>
  );
}
