import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SlPlus } from 'react-icons/sl';

const Dropzone = ({ onDrop, selectedFiles, id, setLicencePhotoHandler }) => {
    const [files, setFiles] = useState(selectedFiles || []);

    useEffect(() => {
        setLicencePhotoHandler(files);
    }, [files]);

    const validator = (file) => {
        const maxSize = 1024 * 1024 * 5; // 5 MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/svg', 'image/gif'];

        if (file.size > maxSize) {
            alert(`File ${file.name} is too large. Maximum size is 5 MB.`);
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            alert(`File ${file.name} is not a valid image file. Allowed types are JPEG and PNG.`);
            return false;
        }

        return true;
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const validFiles = acceptedFiles.filter(validator);
            setFiles((prevFiles) => [...prevFiles, ...validFiles]);
            onDrop(validFiles);
        },
    });

    return (
        <div
            {...getRootProps()}
            id={id}
            className={`${isDragActive ? 'bg-gray-100 dark:bg-navy-900' : 'bg-gray-50 hover:bg-gray-100 dark:bg-navy-800'
                } px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md !bg-transparent transition`}
        >
            <input {...getInputProps()} name='drop-zone' id={id} />
            <div className="text-center">
                <SlPlus className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">
                    Drag and drop some files here, or click to select files
                </p>
            </div>
            {files.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        Selected files
                    </h3>
                    <ul className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                        {files.map((file) => (
                            <li key={file.name} id={file.name} className="py-3 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {file.name}
                                </span>
                                <button
                                    type="button"
                                    className="ml-4 bg-red-500 text-white px-2 py-1 rounded-md"
                                    onClick={() =>
                                        setFiles((prevFiles) =>
                                            prevFiles.filter((prevFile) => prevFile !== file)
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropzone;