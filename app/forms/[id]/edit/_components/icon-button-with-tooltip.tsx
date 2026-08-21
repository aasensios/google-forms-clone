import { IconButton, Tooltip, type IconButtonProps, type TooltipProps } from "@mui/material";

type Props = TooltipProps & {
  title: string;
  onClick?: IconButtonProps["onClick"];
  disabled?: IconButtonProps["disabled"];
  size?: IconButtonProps["size"];
};

export default function IconButtonWithTooltip({
  title,
  onClick,
  disabled,
  size,
  children,
  ...tooltipProps
}: Props) {
  return (
    <Tooltip {...tooltipProps} title={title}>
      <span>
        <IconButton onClick={onClick} disabled={disabled} size={size} aria-label={title}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}
