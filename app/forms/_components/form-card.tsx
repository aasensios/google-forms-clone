import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Card as MuiCard,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Delete,
  DriveFileRenameOutline,
  MoreVert,
  OpenInNew,
  PeopleAltOutlined,
  ViewList,
} from "@mui/icons-material";
import type { Form } from "@/app/types";
import { useRouter } from "next/navigation";

export default function FormCard({
  form,
  onRename,
  onRemove,
}: {
  form: Form;
  onRename: (id: string, newName: string) => void;
  onRemove: (id: string) => void;
}) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(form.name);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (renameOpen) {
      const id = setTimeout(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }, 100);
      return () => clearTimeout(id);
    }
  }, [renameOpen]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRenameOpen = (event: React.MouseEvent) => {
    event.stopPropagation();
    setRenameValue(form.name);
    setRenameOpen(true);
    handleMenuClose();
  };

  const handleRenameConfirm = () => {
    if (renameValue.trim()) {
      onRename(form.id, renameValue.trim());
    }
    setRenameOpen(false);
  };

  const handleRemoveOpen = (event: React.MouseEvent) => {
    event.stopPropagation();
    setRemoveOpen(true);
    handleMenuClose();
  };

  const handleRemoveConfirm = () => {
    onRemove(form.id);
    setRemoveOpen(false);
  };

  const handleOpenNewTab = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(`/forms/${form.id}/edit`, "_blank");
    handleMenuClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      event.target === event.currentTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      router.push(`/forms/${form.id}/edit`);
    }
  };

  return (
    <Stack spacing={1}>
      <MuiCard
        variant="outlined"
        elevation={0}
        role="button"
        tabIndex={0}
        aria-label={`Open form ${form.name}`}
        onClick={() => router.push(`/forms/${form.id}/edit`)}
        onKeyDown={handleKeyDown}
        sx={{
          position: "relative",
          overflow: "visible",
          "&:hover": {
            cursor: "pointer",
            border: (theme) => `1px solid ${theme.palette.primary.main}`,
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "-2px",
          },
        }}
      >
        <CardMedia
          sx={{
            height: 170,
            width: "auto",
            objectFit: "cover",
          }}
          image={form.thumbnailUrl}
          title={form.name}
        />
        <CardContent
          sx={{
            ":last-child": {
              padding: 1.5,
            },
          }}
        >
          <Typography
            variant="body2"
            gutterBottom
            noWrap
            sx={{ fontWeight: 500 }}
          >
            {form.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              paddingInlineEnd: 2,
            }}
          >
            <ViewList color="primary" fontSize="small" />
            {form.shared && (
              <PeopleAltOutlined color="inherit" fontSize="small" />
            )}
            <Typography variant="caption" color="text.secondary" noWrap>
              Opened {form.lastOpen}
            </Typography>
            <IconButton
              aria-label="Form actions"
              size="small"
              onClick={handleMenuOpen}
              sx={{
                position: "absolute",
                right: 4,
                bottom: 4,
              }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              disableScrollLock
              onClick={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleRenameOpen}>
                <ListItemIcon>
                  <DriveFileRenameOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleRemoveOpen}>
                <ListItemIcon>
                  <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleOpenNewTab}>
                <ListItemIcon>
                  <OpenInNew fontSize="small" />
                </ListItemIcon>
                <ListItemText>Open in new tab</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </CardContent>
      </MuiCard>
      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        disableScrollLock
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Rename</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            fullWidth
            label="Form name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            inputRef={renameInputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameConfirm();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleRenameConfirm} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        disableScrollLock
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Move to trash?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            &ldquo;{form.name}&rdquo; will be moved to Drive trash and deleted
            forever after 30 days.
          </Typography>
          <Typography variant="body2">
            If this file is shared, collaborators can still make a copy of it
            until it&rsquo;s permanently deleted.{" "}
            <Link
              variant="body2"
              underline="hover"
              href="https://support.google.com/drive/answer/2375102?visit_id=639187229443877119-640138785&p=restore_trash&rd=1#restore_trash"
              target="_blank"
            >
              Learn more
            </Link>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleRemoveConfirm} variant="contained">
            Move to trash
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
