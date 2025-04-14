import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (() => void) | ((formData: any) => Promise<void>);
  isSubmitting?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  title,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit',
  children,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass an empty object if onSubmit expects an argument
    if (onSubmit.length > 0) {
      (onSubmit as (formData: any) => Promise<void>)({});
    } else {
      (onSubmit as () => void)();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormDialog;
