import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaFileInvoiceDollar, FaFileExport, FaFilePdf, FaCopy } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [reportType, setReportType] = useState('inventory');
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // Simulating API call with timeout
        setTimeout(() => {
          const mockCollections = [
            { id: '1', name: 'Model Cars', itemCount: 12, totalValue: 1575.00 },
            { id: '2', name: 'Pokemon Cards', itemCount: 78, totalValue: 12460.00 },
            { id: '3', name: 'LEGO Sets', itemCount: 8, totalValue: 3250.00 },
            { id: '4', name: 'Rare Coins', itemCount: 42, totalValue: 8750.00 },
            { id: '5', name: 'Postage Stamps', itemCount: 156, totalValue: 4200.00 }
          ];
          
          setCollections(mockCollections);
          setLoading(false);
          
          if (mockCollections.length > 0) {
            setSelectedCollection(mockCollections[0].id);
          }
        }, 1000);
      } catch (error) {
        console.error('Error fetching collections:', error);
        Sentry.captureException(error);
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
  
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      // In a real app, this would generate a real report
      // Here we'll just simulate it with a timeout
      setTimeout(() => {
        toast.success('Report generated successfully!');
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating report:', error);
      Sentry.captureException(error);
      toast.error('Failed to generate report');
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
                      {collection.name} ({collection.itemCount} items, ${collection.totalValue.toLocaleString()})
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="includePurchaseInfo" className="ml-2 text-sm text-gray-700">
                      Include purchase information
                    </label>
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="showValueChange"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
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
                      defaultValue="csv"
                    >
                      <option value="csv">CSV (Spreadsheet)</option>
                      <option value="json">JSON</option>
                      <option value="txt">Plain Text</option>
                      <option value="html">HTML</option>
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="includeDescription" className="ml-2 text-sm text-gray-700">
                      Include descriptions
                    </label>
                  </div>
                  
                  <div className="form-control flex items-center">
                    <input
                      type="checkbox"
                      id="includeImageLinks"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
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
                          defaultChecked
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