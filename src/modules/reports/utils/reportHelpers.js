import html2pdf from 'html2pdf.js';

/**
 * Downloads a PDF file from HTML content
 * @param {string} htmlContent - The HTML content to convert to PDF
 * @param {string} fileName - The name of the file to download
 */
export const downloadPdf = (htmlContent, fileName) => {
  const options = {
    margin: 10,
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // Create a temporary div to render the HTML
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  document.body.appendChild(element);
  
  // Generate and download the PDF
  return html2pdf().from(element).set(options).save().then(() => {
    // Clean up
    document.body.removeChild(element);
  });
};

/**
 * Downloads a CSV file
 * @param {string} csvContent - The CSV content
 * @param {string} fileName - The name of the file to download
 */
export const downloadCsv = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create a download link and trigger it
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Opens JSON data in a new browser tab
 * @param {Object} data - The JSON data to display
 */
export const viewJsonInBrowser = (data) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  // Open in a new tab
  window.open(dataUri, '_blank');
};