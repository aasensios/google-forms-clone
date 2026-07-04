import { IconButton, Tooltip, type IconButtonProps, type TooltipProps } from "@mui/material";

type Props = TooltipProps & {
  onClick?: IconButtonProps["onClick"];
  disabled?: IconButtonProps["disabled"];
  size?: IconButtonProps["size"];
};

export default function IconButtonWithTooltip({
  onClick,
  disabled,
  size,
  children,
  ...tooltipProps
}: Props) {
  return (
    <Tooltip {...tooltipProps}>
      <span>
        <IconButton onClick={onClick} disabled={disabled} size={size}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}
