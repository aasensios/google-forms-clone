'use client'

import type { Question } from "@/app/types";
import {
  CheckBox,
  Close,
  DragIndicatorOutlined,
  InfoOutlined,
  RadioButtonChecked,
  ShuffleOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
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

export default function QuestionOptionsEditor({
  question,
  onUpdate,
  onOptionChange,
  onAddOption,
  onAddOtherOption,
  onRemoveOption,
}: {
  question: Question;
  onUpdate: (id: string, updates: Partial<Question>) => void;
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

  const optionEntries = question.options?.reduce<
    Array<{ key: string; opt: string; index: number }>
  >((entries, opt, i) => {
    if (opt !== OTHER_LABEL) {
      entries.push({
        key: `${question.id}-opt-${i}`,
        opt,
        index: i,
      });
    }
    return entries;
  }, []) ?? [];

  return (
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
          {optionEntries.map((entry) => (
            <OptionRow
              key={entry.key}
              id={entry.key}
              opt={entry.opt}
              index={entry.index}
              questionType={question.type}
              isOther={false}
              autoFocus={entry.index === focusedOptionIndex}
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
    </Box>
  );
}
