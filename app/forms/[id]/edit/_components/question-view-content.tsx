'use client'

import type { Question } from "@/app/types";
import {
  CheckBox,
  RadioButtonChecked,
  ShuffleOutlined,
} from "@mui/icons-material";
import {
  Box,
  TextField,
  Typography,
} from "@mui/material";

export default function QuestionViewContent({
  question,
  onClick,
}: {
  question: Question;
  onClick: () => void;
}) {
  return (
    <Box onClick={onClick} sx={{ cursor: "pointer" }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {question.title || "Question"}{" "}
        {question.required && (
          <Box component="span" sx={{ color: "error.main" }}>
            *
          </Box>
        )}
        {question.shuffle && (
          <ShuffleOutlined
            sx={{ ml: 1, verticalAlign: "middle", fontSize: 18 }}
            color="disabled"
          />
        )}
      </Typography>

      {question.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {question.description}
        </Typography>
      )}

      {question.type === "text" && (
        <TextField
          disabled
          variant="standard"
          fullWidth
          placeholder="Short answer text"
        />
      )}

      {question.type === "paragraph" && (
        <TextField
          disabled
          variant="standard"
          fullWidth
          multiline
          rows={2}
          placeholder="Long answer text"
        />
      )}

      {(question.type === "radio" ||
        question.type === "checkbox" ||
        question.type === "select") && (
        <Box>
          {question.options?.map((opt) => (
            <Box
              key={`${question.id}-${opt}`}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                gap: 1,
              }}
            >
              {question.type === "radio" && (
                <RadioButtonChecked color="disabled" />
              )}
              {question.type === "checkbox" && (
                <CheckBox color="disabled" />
              )}
              {question.type === "select" && (
                <Typography sx={{ width: 24 }}>
                  {question.options!.indexOf(opt) + 1}.
                </Typography>
              )}
              <Typography color="text.secondary">{opt}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
