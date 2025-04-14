import React, { useState } from 'react';
import { 
  Button, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Alert,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import { exportToCSV, downloadCSV, readCSVFile, parseCSV, validateImportData } from '../../utils/importExport';

interface ImportExportButtonsProps {
  entityName: string;  // Name of the entity (e.g., "Clients", "Services")
  data: any[];  // Data to export
  onImport: (data: any[]) => Promise<any>;  // Function to handle imported data, can return any Promise
  requiredFields: string[];  // Fields that are required during import
  validators?: Record<string, (value: any) => string | null>;  // Custom validators for fields
  disabled?: boolean;  // Whether the buttons should be disabled
}

/**
 * A reusable component that provides import and export functionality
 */
const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
  entityName,
  data,
  onImport,
  requiredFields,
  validators,
  disabled = false
}) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<{ row: number; field: string; error: string }[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = () => {
    const csvContent = exportToCSV(data);
    downloadCSV(csvContent, `${entityName.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setImportErrors([]);
      setImportSuccess(false);
    }
  };

  const handleImportDialogClose = () => {
    setImportDialogOpen(false);
    setSelectedFile(null);
    setImportErrors([]);
    setImportSuccess(false);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    setImportErrors([]);
    setImportSuccess(false);

    try {
      // Read and parse the CSV file
      const csvContent = await readCSVFile(selectedFile);
      const parsedData = parseCSV(csvContent);

      // Validate the imported data
      const validationErrors = validateImportData(parsedData, requiredFields, validators);

      if (validationErrors.length > 0) {
        setImportErrors(validationErrors);
        setImporting(false);
        return;
      }

      // Process the import
      await onImport(parsedData);
      setImportSuccess(true);
    } catch (error) {
      console.error('Import error:', error);
      setImportErrors([{ row: 0, field: '', error: `Import failed: ${error instanceof Error ? error.message : String(error)}` }]);
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => setImportDialogOpen(true)}
          disabled={disabled}
        >
          Import {entityName}
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleExport}
          disabled={disabled || data.length === 0}
        >
          Export {entityName}
        </Button>
      </Stack>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={handleImportDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Import {entityName}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Upload a CSV file to import {entityName.toLowerCase()}. The file should have the following columns:
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 2 }}>
              <strong>Required fields:</strong> {requiredFields.join(', ')}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Download the current data as a template using the Export button.
            </Typography>
          </Box>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginBottom: '16px', display: 'block' }}
          />

          {importErrors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Import validation failed with the following errors:</Typography>
              <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                {importErrors.map((error, index) => (
                  <li key={index}>
                    {error.row > 0 ? `Row ${error.row}` : ''} 
                    {error.field ? ` - ${error.field}: ` : ''} 
                    {error.error}
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          {importSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Import completed successfully!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportDialogClose} disabled={importing}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            color="primary" 
            disabled={!selectedFile || importing}
            startIcon={importing ? <CircularProgress size={20} /> : null}
          >
            {importing ? 'Importing...' : 'Import'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportExportButtons;