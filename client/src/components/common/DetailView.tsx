import React from 'react';
import { Box, Typography, Paper, Grid, Divider, CircularProgress } from '@mui/material';

export interface DetailField {
  label: string;
  value: React.ReactNode;
  gridSize?: number; // Optional grid size (1-12)
}

export interface DetailSection {
  title?: string;
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

/**
 * A component for displaying detailed information in a structured format.
 * It organizes data into sections with fields.
 */
const DetailView: React.FC<DetailViewProps> = ({ 
  title, 
  sections, 
  loading = false,
  onEdit,
  onBack,
  actions
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
              {title}
            </Typography>
        {actions}
      </Box>

      {sections.map((section, sectionIndex) => (
        <Box key={sectionIndex} sx={{ mt: sectionIndex > 0 ? 4 : 2 }}>
          {section.title && (
            <>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  mb: 2,
                  color: 'primary.main',
                  fontWeight: 500,
                }}
              >
            {section.title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
            </>
          )}
          
          <Grid container spacing={2}>
            {section.fields.map((field, fieldIndex) => (
              <Grid 
                key={fieldIndex} 
                item 
                xs={12} 
                sm={field.gridSize || 6}
              >
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {field.label}
                  </Typography>
                    <Typography variant="body1">
                    {field.value || '-'}
                    </Typography>
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