/**
 * Utility functions for importing and exporting data in the application
 */

// Generic type for any data entity
type Entity = Record<string, any>;

/**
 * Converts an array of entities to CSV format
 * @param entities Array of entities to convert
 * @param headers Optional custom headers (if not provided, will use object keys)
 * @returns CSV string
 */
export const exportToCSV = <T extends Entity>(entities: T[], headers?: string[]): string => {
  if (!entities || entities.length === 0) {
    return '';
  }

  // Use provided headers or extract from first entity
  const csvHeaders = headers || Object.keys(entities[0]);
  
  // Create header row
  let csvContent = csvHeaders.join(',') + '\n';
  
  // Add data rows
  entities.forEach(entity => {
    const row = csvHeaders.map(header => {
      // Handle special cases like dates, objects, etc.
      const value = entity[header];
      if (value === null || value === undefined) {
        return '';
      } else if (value instanceof Date) {
        return value.toISOString();
      } else if (typeof value === 'object') {
        return JSON.stringify(value).replace(/"/g, '""');
      } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
    
    csvContent += row + '\n';
  });
  
  return csvContent;
};

/**
 * Triggers a download of data as a CSV file
 * @param csvContent CSV content as string
 * @param filename Name of the file to download
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Parse CSV content to an array of objects
 * @param csvContent CSV content as string
 * @returns Array of objects representing the CSV data
 */
export const parseCSV = (csvContent: string): Entity[] => {
  const lines = csvContent.split('\n');
  if (lines.length < 2) return [];
  
  // Extract headers from first line
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse data rows
  const result: Entity[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle quoted values with commas inside
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        if (insideQuotes && j + 1 < line.length && line[j + 1] === '"') {
          // Handle escaped quotes
          currentValue += '"';
          j++;
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // End of value
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    // Create object from headers and values
    const obj: Entity = {};
    headers.forEach((header, index) => {
      if (index < values.length) {
        obj[header] = values[index];
      }
    });
    
    result.push(obj);
  }
  
  return result;
};

/**
 * Read a CSV file and return its content
 * @param file File object to read
 * @returns Promise resolving to the file content as string
 */
export const readCSVFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validate imported data against a schema
 * @param data Array of entities to validate
 * @param requiredFields Array of field names that are required
 * @param validators Optional object with custom validation functions
 * @returns Array of validation errors, empty if all valid
 */
export const validateImportData = <T extends Entity>(
  data: T[],
  requiredFields: string[],
  validators?: Record<string, (value: any) => string | null>
): { row: number; field: string; error: string }[] => {
  const errors: { row: number; field: string; error: string }[] = [];
  
  data.forEach((item, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!item[field] || item[field].toString().trim() === '') {
        errors.push({
          row: index + 1,
          field,
          error: `${field} is required`
        });
      }
    });
    
    // Run custom validators
    if (validators) {
      Object.keys(validators).forEach(field => {
        if (item[field] !== undefined && item[field] !== null) {
          const error = validators[field](item[field]);
          if (error) {
            errors.push({
              row: index + 1,
              field,
              error
            });
          }
        }
      });
    }
  });
  
  return errors;
};
