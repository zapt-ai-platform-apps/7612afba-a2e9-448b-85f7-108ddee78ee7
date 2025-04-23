import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportsPage from '../components/ReportsPage';
import { collectionsApi } from '@/modules/collections/api';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

// Mock dependencies
vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-123' } })
}));

vi.mock('@/modules/collections/api', () => ({
  collectionsApi: {
    getCollections: vi.fn(),
    generateReport: vi.fn()
  }
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('html2pdf.js', () => ({
  default: {
    from: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    save: vi.fn().mockReturnThis(),
    then: vi.fn((callback) => {
      callback();
      return { catch: vi.fn() };
    })
  }
}));

// Mock utilities
const mockDownloadPdf = vi.fn();
const mockDownloadCsv = vi.fn();
const mockViewJsonInBrowser = vi.fn();

// Manually mock the reportHelpers functions
vi.mock('@/modules/reports/utils/reportHelpers', () => ({
  downloadPdf: (htmlContent, fileName) => mockDownloadPdf(htmlContent, fileName),
  downloadCsv: (csvContent, fileName) => mockDownloadCsv(csvContent, fileName),
  viewJsonInBrowser: (data) => mockViewJsonInBrowser(data)
}));

describe('ReportsPage', () => {
  const mockCollections = [
    { id: '1', name: 'Model Cars', itemCount: 12, totalValue: 1575.00 },
    { id: '2', name: 'Pokemon Cards', itemCount: 78, totalValue: 12460.00 }
  ];
  
  beforeEach(() => {
    vi.clearAllMocks();
    collectionsApi.getCollections.mockResolvedValue({ data: mockCollections });
  });
  
  it('renders loading state initially', async () => {
    render(<ReportsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('fetches and displays collections', async () => {
    render(<ReportsPage />);
    
    await waitFor(() => {
      expect(collectionsApi.getCollections).toHaveBeenCalled();
      expect(screen.getByText(/Model Cars/)).toBeInTheDocument();
    });
  });
  
  it('handles report generation for PDF format', async () => {
    const mockPdfResponse = {
      success: true,
      message: 'Report generated successfully',
      report: {
        format: 'pdf',
        htmlContent: '<html><body>Test report</body></html>',
        collectionName: 'Model Cars',
        reportType: 'inventory'
      }
    };
    
    collectionsApi.generateReport.mockResolvedValue(mockPdfResponse);
    
    render(<ReportsPage />);
    
    await waitFor(() => expect(screen.getByText(/Model Cars/)).toBeInTheDocument());
    
    // Select report options
    fireEvent.click(screen.getByLabelText(/PDF Document/));
    
    // Generate report
    fireEvent.click(screen.getByText('Generate Report'));
    
    await waitFor(() => {
      expect(collectionsApi.generateReport).toHaveBeenCalledWith(expect.objectContaining({
        collectionId: '1',
        format: 'pdf'
      }));
      
      expect(toast.success).toHaveBeenCalledWith('Report generated successfully!');
    });
  });
  
  it('handles error during report generation', async () => {
    collectionsApi.generateReport.mockRejectedValue(new Error('API error'));
    
    render(<ReportsPage />);
    
    await waitFor(() => expect(screen.getByText(/Model Cars/)).toBeInTheDocument());
    
    // Generate report
    fireEvent.click(screen.getByText('Generate Report'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to generate report');
    });
  });
  
  it('shows message when no collections are available', async () => {
    collectionsApi.getCollections.mockResolvedValue({ data: [] });
    
    render(<ReportsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No collections found')).toBeInTheDocument();
    });
  });
});