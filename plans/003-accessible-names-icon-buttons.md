# 003 — Give icon buttons accessible names

- **Status**: DONE
- **Commit**: 902270e
- **Severity**: HIGH
- **Category**: Accessibility
- **Rule**: Beyond the scan (MUI Tooltip aria-label cloning; control-has-associated-label family)
- **Estimated scope**: 3 files, ~15 lines

## Problem

**Root cause — `app/forms/[id]/edit/_components/icon-button-with-tooltip.tsx:17-23`.**
MUI's Tooltip sets an `aria-label` by cloning props onto its DIRECT child. Here
the direct child is a plain `<span>`, so the label lands on the (non-interactive,
AT-ignored) span while the inner focusable IconButton stays nameless. Tooltips
still appear because events bubble — masking the bug visually. Affects all 5
consumers: Remove ×2 (`question-options-editor.tsx:152-159, 314-321`),
Duplicate + Delete (`question-edit-content.tsx:~105,156,162`).

Current code:

    // app/forms/[id]/edit/_components/icon-button-with-tooltip.tsx:16-24 — current
    return (
      <Tooltip {...tooltipProps}>
        <span>
          <IconButton onClick={onClick} disabled={disabled} size={size}>
            {children}
          </IconButton>
        </span>
      </Tooltip>
    );

**Secondary sites:**

`app/forms/_components/account-menu.tsx:90-98` — Close button has no
aria-label AND its handler is on the SVG child, so keyboard Enter/Space on the
focused button fires a click event on the BUTTON, which never reaches the SVG:

    <IconButton sx={(theme) => ({ position: 'absolute', right: theme.spacing(1), top: theme.spacing(1) })}>
      <Close onClick={handleCloseUserMenu} />
    </IconButton>

`app/forms/[id]/edit/_components/edit-form-header.tsx:32-34` — back navigation
IconButton has no label:

    <IconButton onClick={() => router.push('/forms')}>
      <ArrowBack />
    </IconButton>

(The sibling preview button at line 39-44 already does this correctly with
`aria-label="preview"` — imitate it.)

## Target

`icon-button-with-tooltip.tsx` — extract `title`, require it as a string, and
name the button directly. The span wrapper STAYS (it is what keeps tooltips
working for disabled buttons):

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

(`title` is destructured out of `...tooltipProps` and re-passed explicitly so
the explicit prop wins over any spread ordering; all current consumers pass a
string title.)

`account-menu.tsx` — handler moves to the IconButton, label added:

    <IconButton
      aria-label="Close"
      onClick={handleCloseUserMenu}
      sx={(theme) => ({
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
      })}
    >
      <Close />
    </IconButton>

`edit-form-header.tsx`:

    <IconButton aria-label="Back to forms" onClick={() => router.push('/forms')}>
      <ArrowBack />
    </IconButton>

## Repo conventions to follow

- Label style exemplar: `edit-form-header.tsx:40` uses lowercase short labels;
  `form-card.tsx:155` uses `"Form actions"`. Use concise sentence-case labels.
- Keep double quotes + semicolons in icon-button-with-tooltip.tsx and
  question-* files; single quotes no-semicolons in account-menu.tsx and
  edit-form-header.tsx.

## Steps

1. Apply the exact target to `icon-button-with-tooltip.tsx`.
2. Apply the account-menu.tsx target (keep surrounding sx exactly).
3. Apply the edit-form-header.tsx target.
4. Re-read the diff; remove unrelated churn.

## Boundaries

- Do NOT remove the `<span>` wrapper in IconButtonWithTooltip.
- Do NOT change tooltip placement/props of consumers.
- Do NOT touch other unnamed-but-decorative icons (`color="disabled"` glyphs in
  option rows are decorative and stay unlabeled).
- Do NOT add dependencies.
- STOP if files drift from excerpts.

## Verification

- **Mechanical**:
  - `bun run lint && bun run build` pass.
  - `npx react-doctor@latest --scope changed` → score not lower than 100.
- **Behavior check**:
  - macOS VoiceOver (Cmd+F5), `/forms/<id>/edit`: activate a question; VO+Right
    through controls — "Remove", "Duplicate", "Delete" buttons must announce
    their names (before: nameless "button").
  - Account menu (avatar top-right): Tab reaches close button announcing
    "Close button"; pressing Enter CLOSES the menu (before: nothing happened).
  - Edit page: Tab to back arrow announces "Back to forms, button"; Enter
    navigates to /forms.
  - Visual regression: tooltips still appear on hover for every wrapped
    button; disabled-state tooltip behavior unchanged.
- **Done when**: all named controls announce correctly, menu closes via
  keyboard, checks pass.
