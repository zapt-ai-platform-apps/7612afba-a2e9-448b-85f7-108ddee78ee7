import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaCamera, FaFile, FaFilePdf, FaFileImage, FaTimes } from 'react-icons/fa';

const FileUploader = ({ 
  files, 
  onFilesChange, 
  allowCamera = true,
  allowMultiple = true, 
  maxFiles = 10,
  acceptedFileTypes = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  label = 'Upload Files',
  dropzoneText = 'Drag & drop files here, or click to select files'
}) => {
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    
    // Check if adding these files would exceed the max files limit
    if (files.length + acceptedFiles.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    
    onFilesChange([...files, ...newFiles]);
  }, [files, onFilesChange, maxFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: allowMultiple
  });

  const removeFile = (index) => {
    const newFiles = [...files];
    // Revoke the URL to avoid memory leaks
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  const captureImage = async () => {
    try {
      // This will only work if the app is running on https or localhost
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera access not supported by your browser");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create video element to show the stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Wait for the video to be ready
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });
      
      // Create a canvas element to capture the frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        // Create a file from the blob
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        file.preview = URL.createObjectURL(file);
        
        // Add the file to our files array
        onFilesChange([...files, file]);
        
        // Stop all video tracks to turn off the camera
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg');
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError("Failed to access camera. Please check camera permissions.");
    }
  };

  // Determine file icon based on mimetype
  const getFileIcon = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) {
      return <FaFileImage />;
    } else if (type === 'application/pdf') {
      return <FaFilePdf />;
    } else {
      return <FaFile />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition cursor-pointer"
      >
        <input {...getInputProps()} />
        <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
        <p className="text-gray-600">{dropzoneText}</p>
        <p className="text-xs text-gray-500 mt-1">
          {`Maximum ${maxFiles} files`}
        </p>
      </div>
      
      {allowCamera && (
        <button
          type="button"
          onClick={captureImage}
          className="btn btn-outline w-full flex items-center justify-center cursor-pointer"
        >
          <FaCamera className="mr-2" />
          Take a Photo
        </button>
      )}
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files ({files.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden bg-gray-50">
                {file.type?.startsWith('image/') ? (
                  <div className="h-24 w-full">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-full flex items-center justify-center bg-gray-100">
                    {getFileIcon(file)}
                  </div>
                )}
                <div className="p-2 text-xs truncate">{file.name}</div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 cursor-pointer"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;