import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Button,
  Grid,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface DetailField {
  label: string;
  value: React.ReactNode;
  gridSize?: number;
}

interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface DetailViewProps {
  title: string;
  sections: DetailSection[];
  loading?: boolean;
  onEdit?: () => void;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const DetailView: React.FC<DetailViewProps> = ({
  title,
  sections,
  loading = false,
  onEdit,
  onBack,
  actions,
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {onBack && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{ mr: 2 }}
              color="inherit"
            >
              Back
            </Button>
          )}
          {loading ? (
            <Skeleton width={200} height={40} />
          ) : (
            <Typography variant="h5" component="h1">
              {title}
            </Typography>
          )}
        </Box>
        <Box>
          {onEdit && (
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={onEdit}
              sx={{ mr: 1 }}
              disabled={loading}
            >
              Edit
            </Button>
          )}
          {actions}
        </Box>
      </Box>

      {sections.map((section, sectionIndex) => (
        <Box key={sectionIndex} sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {section.title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {section.fields.map((field, fieldIndex) => (
              <Grid item xs={12} sm={field.gridSize || 6} key={fieldIndex}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {field.label}
                  </Typography>
                  {loading ? (
                    <Skeleton width="80%" height={24} />
                  ) : (
                    <Typography variant="body1">
                      {field.value || <Typography color="text.secondary">—</Typography>}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Paper>
  );
};

export default DetailView;
