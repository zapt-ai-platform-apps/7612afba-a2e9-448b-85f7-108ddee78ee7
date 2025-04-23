import { authenticateUser, asyncHandler, sendError, createDbClient } from './_apiUtils.js';
import { collections, items } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import Sentry from './_sentry.js';
import html2pdf from 'html2pdf.js';

export default asyncHandler(async (req, res) => {
  try {
    const user = await authenticateUser(req);
    const { client, db } = createDbClient();
    
    try {
      if (req.method !== 'POST') {
        return sendError(res, 405, 'Method not allowed');
      }
      
      const { 
        collectionId, 
        reportType, 
        format, 
        includeImages, 
        includeDescription, 
        includeAttributes,
        includePurchaseInfo,
        showValueChange 
      } = req.body;
      
      if (!collectionId) {
        return sendError(res, 400, 'Collection ID is required');
      }
      
      if (!reportType) {
        return sendError(res, 400, 'Report type is required');
      }
      
      // Verify collection ownership
      const collectionResult = await db.select()
        .from(collections)
        .where(eq(collections.id, collectionId))
        .limit(1);
      
      if (collectionResult.length === 0) {
        return sendError(res, 404, 'Collection not found');
      }
      
      const collection = collectionResult[0];
      
      if (collection.userId !== user.id) {
        return sendError(res, 403, 'You do not have permission to access this collection');
      }
      
      // Fetch items in the collection
      const collectionItems = await db.select()
        .from(items)
        .where(and(
          eq(items.collectionId, collectionId),
          eq(items.userId, user.id)
        ));
      
      // Generate report based on type and format
      let reportData = {};
      
      // Calculate collection statistics
      const totalItems = collectionItems.length;
      const totalValue = collectionItems.reduce((sum, item) => sum + (item.currentValue || 0), 0);
      const totalPurchasePrice = collectionItems.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
      const valueChange = totalValue - totalPurchasePrice;
      const valueChangePercentage = totalPurchasePrice > 0 ? (valueChange / totalPurchasePrice) * 100 : 0;
      
      switch (reportType) {
        case 'inventory':
          reportData = {
            collection: {
              name: collection.name,
              description: collection.description,
              itemCount: totalItems,
              totalValue
            },
            items: collectionItems.map(item => {
              const reportItem = {
                name: item.name,
                currentValue: item.currentValue,
                currency: item.currency || 'USD'
              };
              
              if (includeDescription) reportItem.description = item.description;
              if (includeAttributes) reportItem.attributes = item.attributes;
              if (includeImages) reportItem.images = item.images;
              
              return reportItem;
            })
          };
          break;
        
        case 'valuation':
          reportData = {
            collection: {
              name: collection.name,
              description: collection.description,
              itemCount: totalItems,
              totalValue,
              totalPurchasePrice,
              valueChange,
              valueChangePercentage
            },
            items: collectionItems.map(item => {
              const reportItem = {
                name: item.name,
                currentValue: item.currentValue,
                currency: item.currency || 'USD'
              };
              
              if (includePurchaseInfo) {
                reportItem.purchasePrice = item.purchasePrice;
                reportItem.purchaseDate = item.purchaseDate;
                reportItem.purchasePlace = item.purchasePlace;
              }
              
              if (showValueChange && item.purchasePrice) {
                reportItem.valueChange = (item.currentValue || 0) - (item.purchasePrice || 0);
                reportItem.valueChangePercentage = item.purchasePrice > 0 
                  ? ((item.currentValue || 0) - (item.purchasePrice || 0)) / item.purchasePrice * 100 
                  : 0;
              }
              
              return reportItem;
            })
          };
          break;
        
        case 'insurance':
          reportData = {
            collection: {
              name: collection.name,
              description: collection.description,
              itemCount: totalItems,
              totalValue,
              date: new Date().toISOString()
            },
            items: collectionItems.map(item => ({
              name: item.name,
              description: item.description,
              currentValue: item.currentValue,
              currency: item.currency || 'USD',
              purchasePrice: item.purchasePrice,
              purchaseDate: item.purchaseDate,
              condition: item.condition,
              attributes: item.attributes,
              images: includeImages ? item.images : []
            }))
          };
          break;
        
        default:
          return sendError(res, 400, 'Invalid report type');
      }
      
      // Generate report format
      if (format === 'csv') {
        // Generate CSV content
        const headers = ['Name', 'Description', 'Current Value', 'Currency'];
        
        if (reportType === 'valuation' && includePurchaseInfo) {
          headers.push('Purchase Price', 'Purchase Date', 'Purchase Place');
        }
        
        if (reportType === 'valuation' && showValueChange) {
          headers.push('Value Change', 'Value Change %');
        }
        
        if (includeAttributes) {
          // Find all unique attribute keys
          const attributeKeys = new Set();
          reportData.items.forEach(item => {
            if (item.attributes) {
              Object.keys(item.attributes).forEach(key => attributeKeys.add(key));
            }
          });
          attributeKeys.forEach(key => headers.push(`Attribute: ${key}`));
        }
        
        // Create CSV rows
        let csvContent = headers.join(',') + '\n';
        
        reportData.items.forEach(item => {
          const row = [
            `"${item.name || ''}"`,
            `"${(item.description || '').replace(/"/g, '""')}"`,
            item.currentValue || '',
            item.currency || 'USD'
          ];
          
          if (reportType === 'valuation' && includePurchaseInfo) {
            row.push(
              item.purchasePrice || '',
              item.purchaseDate ? new Date(item.purchaseDate).toISOString().split('T')[0] : '',
              `"${(item.purchasePlace || '').replace(/"/g, '""')}"`
            );
          }
          
          if (reportType === 'valuation' && showValueChange) {
            row.push(
              item.valueChange || '',
              item.valueChangePercentage ? item.valueChangePercentage.toFixed(2) + '%' : ''
            );
          }
          
          if (includeAttributes) {
            // Add attribute values in the same order as headers
            attributeKeys.forEach(key => {
              const value = item.attributes && item.attributes[key] ? item.attributes[key] : '';
              row.push(`"${(value.toString() || '').replace(/"/g, '""')}"`);
            });
          }
          
          csvContent += row.join(',') + '\n';
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${collection.name}-${reportType}-report.csv`);
        return res.status(200).send(csvContent);
      } else if (format === 'pdf') {
        // For simplicity, we'll create a basic HTML representation of the data
        // that can be converted to PDF
        let htmlContent = `
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              h1 { color: #4F46E5; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background-color: #f3f4f6; text-align: left; padding: 8px; }
              td { border-bottom: 1px solid #e5e7eb; padding: 8px; }
              .collection-info { margin-bottom: 20px; }
              .report-date { color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <h1>${collection.name} - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1>
            <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
            
            <div class="collection-info">
              <p>${collection.description || ''}</p>
              <p>Total Items: ${totalItems}</p>
              <p>Total Value: $${totalValue.toFixed(2)}</p>
        `;
        
        if (reportType === 'valuation') {
          htmlContent += `
              <p>Total Purchase Price: $${totalPurchasePrice.toFixed(2)}</p>
              <p>Value Change: $${valueChange.toFixed(2)} (${valueChangePercentage.toFixed(2)}%)</p>
          `;
        }
        
        htmlContent += `
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Name</th>
        `;
        
        if (includeDescription) {
          htmlContent += `<th>Description</th>`;
        }
        
        htmlContent += `
                  <th>Current Value</th>
        `;
        
        if (reportType === 'valuation' && includePurchaseInfo) {
          htmlContent += `
                  <th>Purchase Price</th>
                  <th>Purchase Date</th>
          `;
        }
        
        if (reportType === 'valuation' && showValueChange) {
          htmlContent += `
                  <th>Value Change</th>
                  <th>Value Change %</th>
          `;
        }
        
        htmlContent += `
                </tr>
              </thead>
              <tbody>
        `;
        
        reportData.items.forEach(item => {
          htmlContent += `
                <tr>
                  <td>${item.name}</td>
          `;
          
          if (includeDescription) {
            htmlContent += `<td>${item.description || ''}</td>`;
          }
          
          htmlContent += `
                  <td>${item.currency || '$'}${item.currentValue ? item.currentValue.toFixed(2) : '0.00'}</td>
          `;
          
          if (reportType === 'valuation' && includePurchaseInfo) {
            htmlContent += `
                  <td>${item.currency || '$'}${item.purchasePrice ? item.purchasePrice.toFixed(2) : '0.00'}</td>
                  <td>${item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : ''}</td>
            `;
          }
          
          if (reportType === 'valuation' && showValueChange) {
            const valueChange = (item.currentValue || 0) - (item.purchasePrice || 0);
            const valueChangePercentage = item.purchasePrice 
              ? (valueChange / item.purchasePrice) * 100 
              : 0;
            
            htmlContent += `
                  <td>${valueChange >= 0 ? '+' : ''}${item.currency || '$'}${valueChange.toFixed(2)}</td>
                  <td>${valueChangePercentage >= 0 ? '+' : ''}${valueChangePercentage.toFixed(2)}%</td>
            `;
          }
          
          htmlContent += `
                </tr>
          `;
        });
        
        htmlContent += `
              </tbody>
            </table>
          </body>
          </html>
        `;
        
        // For this demonstration, we'll just return the HTML
        // In a real implementation, we would use a library like html-pdf to convert this to a PDF
        reportData.htmlContent = htmlContent;
        reportData.format = 'pdf';
      } else {
        // Default: JSON format
        reportData.format = 'json';
      }
      
      return res.status(200).json({
        success: true,
        message: 'Report generated successfully',
        report: reportData
      });
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('Error in generate report API:', error);
    Sentry.captureException(error);
    return sendError(res, 500, 'Internal server error');
  }
});