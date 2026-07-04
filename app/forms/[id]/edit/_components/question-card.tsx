"use client";

import { QUESTION_TYPES } from "@/app/forms/constants/question-types";
import type { Question, QuestionType } from "@/app/types";
import {
  CheckBox,
  Close,
  ContentCopy,
  DeleteOutlined,
  DragHandle,
  DragIndicatorOutlined,
  InfoOutlined,
  RadioButtonChecked,
  ShuffleOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CardActions,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButtonWithTooltip from "./icon-button-with-tooltip";
import { useEffect, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const OTHER_LABEL = "Other\u2026";

function OptionRow({
  id,
  opt,
  index,
  questionType,
  isOther,
  autoFocus,
  onOptionChange,
  onRemoveOption,
  questionId,
}: {
  id: string;
  opt: string;
  index: number;
  questionType: string;
  isOther: boolean;
  autoFocus?: boolean;
  onOptionChange: (qId: string, optIndex: number, value: string) => void;
  onRemoveOption: (qId: string, optIndex: number) => void;
  questionId: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1,
        gap: 1,
        position: "relative",
        "&:hover .drag-handle": { opacity: 1 },
      }}
    >
      <Box sx={{ position: "relative", width: 0, flexShrink: 0 }}>
        {!isOther && (
          <Box
            {...attributes}
            {...listeners}
            className="drag-handle"
            sx={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              cursor: "grab",
              touchAction: "none",
              opacity: 0,
              transition: "opacity 150ms ease",
            }}
          >
            <DragIndicatorOutlined fontSize="small" color="disabled" />
          </Box>
        )}
      </Box>
      {questionType === "radio" && <RadioButtonChecked color="disabled" />}
      {questionType === "checkbox" && <CheckBox color="disabled" />}
      {questionType === "select" && (
        <Typography sx={{ width: 24, textAlign: "center" }}>
          {index + 1}.
        </Typography>
      )}
      {isOther ? (
        <>
          <Typography sx={{ whiteSpace: "nowrap", fontWeight: 500 }}>
            Other:
          </Typography>
          <Box
            sx={{
              flex: 1,
              borderBottom: "1px dotted",
              borderColor: "text.disabled",
              height: 0,
              alignSelf: "flex-end",
              mb: 0.25,
            }}
          />
        </>
      ) : (
        <TextField
          variant="standard"
          fullWidth
          value={opt}
          onChange={(e) => onOptionChange(questionId, index, e.target.value)}
          inputRef={inputRef}
        />
      )}
      <IconButtonWithTooltip
        title="Remove"
        placement="right"
        size="small"
        onClick={() => onRemoveOption(questionId, index)}
      >
        <Close />
      </IconButtonWithTooltip>
    </Box>
  );
}

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
  const optionSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleOptionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex =
      question.options?.findIndex(
        (_, i) => `${question.id}-opt-${i}` === active.id,
      ) ?? -1;
    const newIndex =
      question.options?.findIndex(
        (_, i) => `${question.id}-opt-${i}` === over.id,
      ) ?? -1;

    if (oldIndex === -1 || newIndex === -1) return;

    const newOptions = [...(question.options || [])];
    const [moved] = newOptions.splice(oldIndex, 1);
    newOptions.splice(newIndex, 0, moved);

    const otherIdx = newOptions.findIndex((opt) => opt === OTHER_LABEL);
    if (otherIdx !== -1 && otherIdx !== newOptions.length - 1) {
      const [other] = newOptions.splice(otherIdx, 1);
      newOptions.push(other);
    }

    onUpdate(question.id, { options: newOptions });
  };

  const optionIds =
    question.options
      ?.map((opt, i) =>
        opt !== OTHER_LABEL ? `${question.id}-opt-${i}` : null,
      )
      .filter((id): id is string => id !== null) ?? [];

  const otherIndex: number | undefined = question.options?.findIndex(
    (opt) => opt === OTHER_LABEL,
  );

  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | null>(
    null,
  );

  const handleAddOption = () => {
    const options = question.options || [];
    const insertIndex =
      otherIndex !== undefined && otherIndex !== -1
        ? otherIndex
        : options.length;
    setFocusedOptionIndex(insertIndex);
    onAddOption(question.id);
  };

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
      {/* Reorder Controls (Handle) */}
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
        // Edit Mode
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

          {/* Options Area based on Type */}
          {(question.type === "radio" ||
            question.type === "checkbox" ||
            question.type === "select") && (
            <Box>
              <DndContext
                id={`options-${question.id}`}
                sensors={optionSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleOptionDragEnd}
              >
                <SortableContext
                  items={optionIds}
                  strategy={verticalListSortingStrategy}
                >
                  {question.options
                    ?.map((opt, i) => ({ opt, i }))
                    .filter(({ opt }) => opt !== OTHER_LABEL)
                    .map(({ opt, i }) => (
                      <OptionRow
                        key={`${question.id}-opt-${i}`}
                        id={`${question.id}-opt-${i}`}
                        opt={opt}
                        index={i}
                        questionType={question.type}
                        isOther={false}
                        autoFocus={i === focusedOptionIndex}
                        onOptionChange={onOptionChange}
                        onRemoveOption={onRemoveOption}
                        questionId={question.id}
                      />
                    ))}
                </SortableContext>
              </DndContext>
              {otherIndex != null && otherIndex !== -1 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    gap: 1,
                  }}
                >
                  <Box sx={{ width: 0, flexShrink: 0 }} />
                  {question.type === "radio" && (
                    <RadioButtonChecked color="disabled" />
                  )}
                  {question.type === "checkbox" && (
                    <CheckBox color="disabled" />
                  )}
                  {question.type === "select" && (
                    <Typography sx={{ width: 24, textAlign: "center" }}>
                      {otherIndex + 1}.
                    </Typography>
                  )}
                  <Typography sx={{ whiteSpace: "nowrap", fontWeight: 500 }}>
                    Other:
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      borderBottom: "1px dotted",
                      borderColor: "text.disabled",
                      height: 0,
                      alignSelf: "flex-end",
                      mb: 0.25,
                    }}
                  />
                  <IconButtonWithTooltip
                    title="Remove"
                    placement="right"
                    size="small"
                    onClick={() => onRemoveOption(question.id, otherIndex)}
                  >
                    <Close />
                  </IconButtonWithTooltip>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  gap: 1,
                }}
              >
                <Button size="small" color="primary" onClick={handleAddOption}>
                  Add option
                </Button>
                {!question.options?.some((opt) => opt === OTHER_LABEL) && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      or
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => onAddOtherOption(question.id)}
                    >
                      add &ldquo;Other&rdquo;
                    </Button>
                  </>
                )}
              </Box>
              {(question.type === "radio" ||
                question.type === "checkbox" ||
                question.type === "select") && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!question.shuffle}
                      onChange={(e) =>
                        onUpdate(question.id, {
                          shuffle: e.target.checked,
                        })
                      }
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Random order
                      </Typography>
                      <Tooltip
                        title="Reduces position bias for more reliable responses"
                        arrow
                      >
                        <InfoOutlined
                          sx={{
                            fontSize: 16,
                            color: "text.disabled",
                            cursor: "help",
                          }}
                        />
                      </Tooltip>
                    </Box>
                  }
                  sx={{ mt: 1, ml: 0 }}
                />
              )}
            </Box>
          )}

          {/* Footer Actions */}
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
      ) : (
        // View Mode
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
              {question.options?.map((opt: string, i: number) => (
                <Box
                  key={i}
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
                    <Typography sx={{ width: 24 }}>{i + 1}.</Typography>
                  )}
                  <Typography color="text.secondary">{opt}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}
