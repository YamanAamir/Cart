'use client';
import Papa from "papaparse";
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft } from 'lucide-react';

export default function BulkImportPage() {
  const router = useRouter();
  const [headers, setHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Format numbers to whole numbers or decimals
  const formatNumber = (value) => {
    if (typeof value !== 'string' && typeof value !== 'number') return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toString();
  };

  const downloadSample = () => {
  const csvContent = `Brand,Model,Type,Name,Color,Stock,Sale Price,Regular Price
Yamaha,Drive2,Enclosure,3 x 4 Universal Enclosure,Red,10,1500,1800
EZGO,TXT,Accessories,Seat Cover,,25,120,150
Club Car,Onward,Hard Goods,Battery Charger,,5,850,950
`;

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "sample_products.csv";
  link.click();

  URL.revokeObjectURL(url);
};


  const onDrop = useCallback((acceptedFiles) => {
  const file = acceptedFiles[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    delimiter: "", // auto-detects comma or tab
    complete: (results) => {
      const data = results.data.filter(
        (row) => row.Name || row.name
      );

      setHeaders(results.meta.fields.filter(h => h !== "S no"));
      setCsvData(data);
    },
    error: (err) => {
      console.error("CSV Parse Error:", err);
    }
  });
}, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    disabled: isLoading,
  });

  const handleCellEdit = (rowIdx, header, value) => {
    setCsvData((prev) =>
      prev.map((row, i) => (i === rowIdx ? { ...row, [header]: value } : row))
    );
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleBulkUpload = async () => {
    const productsData = csvData.map((row) => ({
  name: row.Name,
  brand: row.Brand,
  model: row.Model,
  type: row.Type,
  color: row.Color || null,
  stock: row.Stock,
  imageOne: row.imageOne,
  imageTwo: row.imageTwo,
  imageThree: row.imageThree,
  imageFour: row.imageFour,
  salePrice: row["Sale Price"],
  regularPrice: row["Regular Price"],
  weightLb:row.weightLb,
  lengthIn:row.lengthIn,
  widthIn:row.widthIn,
  heightIn:row.heightIn,
  description:row.description,
}));



    if (productsData.length === 0) {
      toast.error('No valid products found in CSV');
      return;
    }

    setIsLoading(true);
    try {
      const batchSize = 100;
      let createdCount = 0;
      let skippedCount = 0;

      for (let i = 0; i < productsData.length; i += batchSize) {
        const batch = productsData.slice(i, i + batchSize);
        const response = await api.post('/products/import-csv', {
          products: batch,
        });

        createdCount += response.data.created;
        skippedCount += response.data.skipped;

        setProgress(Math.round(((i + batchSize) / productsData.length) * 100));
      }

      toast.success(
        `Products imported successfully: ${createdCount} created, ${skippedCount} skipped`
      );
      router.push('/admin/products/list');
    } catch (error) {
      console.error('Error importing products:', error);
      toast.error(error.response?.data?.message || 'Failed to import products');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products/list');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Bulk Import CSV</h1>
          <Button onClick={downloadSample} variant="outline" size="sm">
            Download Sample CSV
          </Button>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <p className="text-sm sm:text-base text-gray-600">
          {isDragActive
            ? 'Drop the CSV file here...'
            : 'Drag & drop CSV file here, or click to select'}
        </p>
      </div>

      {csvData.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">CSV Preview</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              {isLoading && (
                <div className="flex items-center gap-2 text-sm">
                  Progress: {progress}%
                </div>
              )}
              <Button
                onClick={handleEditToggle}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, idx) => (
                    <TableHead key={idx} className="whitespace-nowrap">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {headers.map((header, colIdx) => (
                      <TableCell key={colIdx}>
                        {isEditing ? (
                          <Input
                            value={row[header] || ''}
                            onChange={(e) =>
                              handleCellEdit(rowIdx, header, e.target.value)
                            }
                            className="w-full min-w-[150px] sm:min-w-[200px] border-none focus:ring-0 bg-transparent text-xs sm:text-sm"
                            disabled={isLoading}
                          />
                        ) : (
                          <span className="text-xs sm:text-sm">
                            {formatNumber(row[header]) || ''}
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpload}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? `Uploading... ${progress}%` : 'Upload'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}