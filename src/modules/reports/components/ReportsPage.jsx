import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaFileInvoiceDollar, FaFileExport, FaFilePdf, FaCopy } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';
import { collectionsApi } from '@/modules/collections/api';
import html2pdf from 'html2pdf.js';

export default function ReportsPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [reportType, setReportType] = useState('inventory');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Report options
  const [includeImages, setIncludeImages] = useState(false);
  const [includeDescription, setIncludeDescription] = useState(true);
  const [includeAttributes, setIncludeAttributes] = useState(true);
  const [includePurchaseInfo, setIncludePurchaseInfo] = useState(true);
  const [showValueChange, setShowValueChange] = useState(true);
  const [outputFormat, setOutputFormat] = useState('pdf');
  
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        const response = await collectionsApi.getCollections();
        
        if (response.data) {
          setCollections(response.data);
          
          if (response.data.length > 0) {
            setSelectedCollection(response.data[0].id);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collections:', error);
        Sentry.captureException(error);
        toast.error('Failed to fetch collections');
        setLoading(false);
      }
    };
    
    fetchCollections();
  }, [user]);
  
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };
  
  const handleCollectionChange = (e) => {
    setSelectedCollection(e.target.value);
  };
  
  const handleOutputFormatChange = (format) => {
    setOutputFormat(format);
  };
  
  const downloadPdf = (htmlContent, fileName) => {
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
    html2pdf().from(element).set(options).save().then(() => {
      // Clean up
      document.body.removeChild(element);
    });
  };
  
  const downloadCsv = (csvContent, fileName) => {
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
  
  const handleGenerateReport = async () => {
    try {
      if (!selectedCollection) {
        toast.error('Please select a collection');
        return;
      }
      
      setIsGenerating(true);
      
      const reportData = {
        collectionId: selectedCollection,
        reportType: reportType,
        format: outputFormat,
        includeImages: includeImages,
        includeDescription: includeDescription,
        includeAttributes: includeAttributes,
        includePurchaseInfo: includePurchaseInfo,
        showValueChange: showValueChange
      };
      
      console.log('Generating report with data:', reportData);
      
      const response = await collectionsApi.generateReport(reportData);
      
      if (response.success) {
        toast.success('Report generated successfully!');
        
        const collection = collections.find(c => c.id === selectedCollection);
        const fileName = `${collection?.name || 'Collection'}-${reportType}-report`;
        
        // Handle different formats
        if (response.report.format === 'pdf' && response.report.htmlContent) {
          downloadPdf(response.report.htmlContent, `${fileName}.pdf`);
        } else if (outputFormat === 'csv' && response instanceof Blob) {
          // For CSV, response is handled directly as a blob
          downloadCsv(await response.text(), `${fileName}.csv`);
        } else {
          // For JSON format or online view, we can display in a new tab
          const dataStr = JSON.stringify(response.report, null, 2);
          const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
          
          // Open in a new tab
          window.open(dataUri, '_blank');
        }
      } else {
        toast.error(response.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      Sentry.captureException(error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const ReportOption = ({ value, icon, title, description }) => (
    <label className="relative block rounded-lg border border-gray-200 bg-white p-4 cursor-pointer">
      <input
        type="radio"
        name="reportType"
        value={value}
        checked={reportType === value}
        onChange={handleReportTypeChange}
        className="sr-only"
      />
      <div className="flex items-start">
        <div className={`text-lg rounded-full p-3 ${reportType === value ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className={`absolute -inset-px rounded-lg border-2 pointer-events-none ${reportType === value ? 'border-indigo-500' : 'border-transparent'}`} aria-hidden="true"></div>
    </label>
  );
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">
          Generate reports for your collections
        </p>
      </header>
      
      {collections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
          <p className="text-gray-600">Create collections to generate reports.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Report Type Selection */}
          <div className="card">
            <div className="card-header">
              Report Type
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ReportOption
                  value="inventory"
                  icon={<FaFileAlt />}
                  title="Inventory Report"
                  description="Complete list of items in your collection"
                />
                
                <ReportOption
                  value="valuation"
                  icon={<FaFileInvoiceDollar />}
                  title="Valuation Report"
                  description="Current value of your collection with details"
                />
                
                <ReportOption
                  value="insurance"
                  icon={<FaFilePdf />}
                  title="Insurance Report"
                  description="Detailed report for insurance purposes"
                />
                
                <ReportOption
                  value="listing"
                  icon={<FaFileExport />}
                  title="Listing Export"
                  description="Export items for marketplace listings"
                />
              </div>
            </div>
          </div>
          
          {/* Report Options */}
          <div className="card">
            <div className="card-header">
              Report Options
            </div>
            <div className="card-body">
              <div className="form-control">
                <label htmlFor="collection" className="form-label">Collection</label>
                <select
                  id="collection"
                  value={selectedCollection}
                  onChange={handleCollectionChange}
                  className="form-input box-border"
                >
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name} ({collection.itemCount || 0} items, $
                      {collection.totalValue ? collection.totalValue.toLocaleString() : '0'})
                    </option>
                  ))}
                </select>
              </div>
              
              {reportType === 'inventory' && (
                <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-4">
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includeImages"
                      checked={includeImages}
                      onChange={(e) => setIncludeImages(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeImages" className="ml-2 text-sm text-gray-700">
                      Include images
                    </label>
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includeDescription"
                      checked={includeDescription}
                      onChange={(e) => setIncludeDescription(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeDescription" className="ml-2 text-sm text-gray-700">
                      Include descriptions
                    </label>
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includeAttributes"
                      checked={includeAttributes}
                      onChange={(e) => setIncludeAttributes(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeAttributes" className="ml-2 text-sm text-gray-700">
                      Include attributes
                    </label>
                  </div>
                </div>
              )}
              
              {reportType === 'valuation' && (
                <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-4">
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includePurchaseInfo"
                      checked={includePurchaseInfo}
                      onChange={(e) => setIncludePurchaseInfo(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includePurchaseInfo" className="ml-2 text-sm text-gray-700">
                      Include purchase information
                    </label>
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="showValueChange"
                      checked={showValueChange}
                      onChange={(e) => setShowValueChange(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showValueChange" className="ml-2 text-sm text-gray-700">
                      Show value change over time
                    </label>
                  </div>
                </div>
              )}
              
              {reportType === 'insurance' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label htmlFor="policyNumber" className="form-label">Policy Number (optional)</label>
                    <input
                      type="text"
                      id="policyNumber"
                      className="form-input box-border"
                      placeholder="Enter your insurance policy number"
                    />
                  </div>
                  
                  <div className="form-control">
                    <label htmlFor="coverageDate" className="form-label">Coverage Date</label>
                    <input
                      type="date"
                      id="coverageDate"
                      className="form-input box-border"
                    />
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includeReceipts"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeReceipts" className="ml-2 text-sm text-gray-700">
                      Include available receipts
                    </label>
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includeDetailedPhotos"
                      checked={includeImages}
                      onChange={(e) => setIncludeImages(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeDetailedPhotos" className="ml-2 text-sm text-gray-700">
                      Include detailed photos
                    </label>
                  </div>
                </div>
              )}
              
              {reportType === 'listing' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label htmlFor="exportFormat" className="form-label">Export Format</label>
                    <select
                      id="exportFormat"
                      className="form-input box-border"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                    >
                      <option value="csv">CSV (Spreadsheet)</option>
                      <option value="json">JSON</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>
                  
                  <div className="form-control">
                    <label htmlFor="listingStatus" className="form-label">Items to Include</label>
                    <select
                      id="listingStatus"
                      className="form-input box-border"
                      defaultValue="all"
                    >
                      <option value="all">All Items</option>
                      <option value="for_sale">For Sale Only</option>
                      <option value="not_for_sale">Not For Sale Only</option>
                    </select>
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includeDescription"
                      checked={includeDescription}
                      onChange={(e) => setIncludeDescription(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeDescription" className="ml-2 text-sm text-gray-700">
                      Include descriptions
                    </label>
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includeImageLinks"
                      checked={includeImages}
                      onChange={(e) => setIncludeImages(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeImageLinks" className="ml-2 text-sm text-gray-700">
                      Include image links
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Output Format */}
          <div className="card">
            <div className="card-header">
              Output Format
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative block rounded-lg border border-gray-200 bg-white p-4 cursor-pointer">
                  <div className="flex items-center">
                    <div className="text-lg rounded-full p-3 bg-red-100 text-red-600">
                      <FaFilePdf />
                    </div>
                    <div className="ml-4">
                      <label htmlFor="formatPdf" className="font-medium text-gray-900 block cursor-pointer">
                        <input
                          type="radio"
                          name="outputFormat"
                          id="formatPdf"
                          checked={outputFormat === 'pdf'}
                          onChange={() => handleOutputFormatChange('pdf')}
                          className="mr-2"
                        />
                        PDF Document
                      </label>
                      <p className="text-sm text-gray-500">Professional format for printing</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative block rounded-lg border border-gray-200 bg-white p-4 cursor-pointer">
                  <div className="flex items-center">
                    <div className="text-lg rounded-full p-3 bg-green-100 text-green-600">
                      <FaFileExport />
                    </div>
                    <div className="ml-4">
                      <label htmlFor="formatCsv" className="font-medium text-gray-900 block cursor-pointer">
                        <input
                          type="radio"
                          name="outputFormat"
                          id="formatCsv"
                          checked={outputFormat === 'csv'}
                          onChange={() => handleOutputFormatChange('csv')}
                          className="mr-2"
                        />
                        Spreadsheet (CSV)
                      </label>
                      <p className="text-sm text-gray-500">Editable in Excel or Google Sheets</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative block rounded-lg border border-gray-200 bg-white p-4 cursor-pointer">
                  <div className="flex items-center">
                    <div className="text-lg rounded-full p-3 bg-blue-100 text-blue-600">
                      <FaCopy />
                    </div>
                    <div className="ml-4">
                      <label htmlFor="formatOnline" className="font-medium text-gray-900 block cursor-pointer">
                        <input
                          type="radio"
                          name="outputFormat"
                          id="formatOnline"
                          checked={outputFormat === 'json'}
                          onChange={() => handleOutputFormatChange('json')}
                          className="mr-2"
                        />
                        Online View
                      </label>
                      <p className="text-sm text-gray-500">View in browser and share with a link</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateReport}
              className="btn btn-primary px-8 py-3 text-lg cursor-pointer"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </div>
              ) : 'Generate Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}