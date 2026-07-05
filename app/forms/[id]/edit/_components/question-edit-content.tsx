'use client'

import { QUESTION_TYPES } from "@/app/forms/constants/question-types";
import type { Question, QuestionType } from "@/app/types";
import {
  Close,
  ContentCopy,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CardActions,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import IconButtonWithTooltip from "./icon-button-with-tooltip";
import QuestionOptionsEditor from "./question-options-editor";

export default function QuestionEditContent({
  question,
  onUpdate,
  onOptionChange,
  onAddOption,
  onAddOtherOption,
  onRemoveOption,
  onDelete,
  onDuplicate,
}: {
  question: Question;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onOptionChange: (qId: string, optIndex: number, value: string) => void;
  onAddOption: (qId: string) => void;
  onAddOtherOption: (qId: string) => void;
  onRemoveOption: (qId: string, optIndex: number) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          variant="filled"
          slotProps={{ htmlInput: { "aria-label": "Question" } }}
          value={question.title}
          onChange={(e) =>
            onUpdate(question.id, {
              title: e.target.value,
            })
          }
        />
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            value={question.type}
            onChange={(e) =>
              onUpdate(question.id, {
                type: e.target.value as QuestionType,
              })
            }
            displayEmpty
          >
            {QUESTION_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {type.icon}
                  {type.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {question.description !== undefined && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            variant="filled"
            size="small"
            placeholder="Description"
            value={question.description || ""}
            onChange={(e) =>
              onUpdate(question.id, {
                description: e.target.value,
              })
            }
            sx={{
              flex: 1,
              "& .MuiFilledInput-input": { py: 1 },
            }}
          />
          <IconButtonWithTooltip
            title="Remove description"
            size="small"
            onClick={() =>
              onUpdate(question.id, { description: undefined })
            }
          >
            <Close />
          </IconButtonWithTooltip>
        </Box>
      )}
      {question.description === undefined && (
        <Button
          size="small"
          onClick={() => onUpdate(question.id, { description: "" })}
          sx={{ alignSelf: "flex-start" }}
        >
          Add description
        </Button>
      )}

      {(question.type === "radio" ||
        question.type === "checkbox" ||
        question.type === "select") && (
        <QuestionOptionsEditor
          question={question}
          onUpdate={onUpdate}
          onOptionChange={onOptionChange}
          onAddOption={onAddOption}
          onAddOtherOption={onAddOtherOption}
          onRemoveOption={onRemoveOption}
        />
      )}

      <Divider sx={{ my: 1 }} />
      <CardActions sx={{ justifyContent: "space-between", px: 0, py: 0 }}>
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Switch
              checked={question.required}
              onChange={(e) =>
                onUpdate(question.id, {
                  required: e.target.checked,
                })
              }
            />
          }
          label={<Typography variant="body2">Required</Typography>}
        />
        <Stack direction="row" spacing={1}>
          <IconButtonWithTooltip
            title="Duplicate"
            onClick={() => onDuplicate(question.id)}
          >
            <ContentCopy />
          </IconButtonWithTooltip>
          <IconButtonWithTooltip
            title="Delete"
            onClick={() => onDelete(question.id)}
          >
            <DeleteOutlined />
          </IconButtonWithTooltip>
        </Stack>
      </CardActions>
    </Stack>
  );
}
