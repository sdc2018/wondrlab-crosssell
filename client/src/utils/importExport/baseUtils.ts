/**
 * Base utilities for importing and exporting data
 */

// Function to convert data to CSV format
export const convertToCSV = <T>(data: T[], headers: string[], getRowData: (item: T) => string[]): string => {
  // Create CSV header row
  const headerRow = headers.join(',');
  
  // Create CSV data rows
  const dataRows = data.map(item => getRowData(item).join(','));
  
  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
};

// Function to parse CSV data
export const parseCSV = <T>(csvData: string, headers: string[], createObject: (rowData: Record<string, string>) => T): T[] => {
  // Split CSV into rows
  const rows = csvData.split('\n');
  
  // Remove header row
  const dataRows = rows.slice(1);
  
  // Parse each row into an object
  return dataRows.map(row => {
    const values = row.split(',');
    const rowData: Record<string, string> = {};
    
    // Map values to headers
    headers.forEach((header, index) => {
      rowData[header] = values[index] || '';
    });
    
    // Create object from row data
    return createObject(rowData);
  });
};

// Function to convert data to JSON format
export const convertToJSON = <T>(data: T[]): string => {
  return JSON.stringify(data, null, 2);
};

// Function to parse JSON data
export const parseJSON = <T>(jsonData: string): T[] => {
  return JSON.parse(jsonData);
};

// Function to download data as a file
export const downloadFile = (data: string, filename: string, mimeType: string): void => {
  // Create blob with data
  const blob = new Blob([data], { type: mimeType });
  
  // Create download URL
  const url = URL.createObjectURL(blob);
  
  // Create temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to download data as CSV
export const downloadCSV = <T>(data: T[], headers: string[], getRowData: (item: T) => string[], filename: string): void => {
  const csvData = convertToCSV(data, headers, getRowData);
  downloadFile(csvData, filename, 'text/csv');
};

// Function to download data as JSON
export const downloadJSON = <T>(data: T[], filename: string): void => {
  const jsonData = convertToJSON(data);
  downloadFile(jsonData, filename, 'application/json');
};

// Function to handle file upload
export const handleFileUpload = (file: File, onLoad: (content: string) => void): void => {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    if (event.target && event.target.result) {
      onLoad(event.target.result as string);
    }
  };
  
  reader.readAsText(file);
};
