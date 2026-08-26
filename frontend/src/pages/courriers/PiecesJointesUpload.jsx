import React, { useState, useRef } from 'react';

export default function PiecesJointesUpload({ files, setFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Formater la taille des fichiers
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Ajouter les nouveaux fichiers au tableau existant
  const addFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    setFiles((prevFiles) => [...prevFiles, ...fileList]);
  };

  // Handlers pour le Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // Réinitialiser la valeur pour autoriser la sélection du même fichier
      e.target.value = '';
    }
  };

  // Supprimer un fichier spécifique par son index
  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full space-y-3 font-sans">
      <label className="block text-xs font-bold text-gray-700">
        11. Pièces jointes <span className="font-normal text-gray-500">(Zone de Téléchargement et Liste)</span>
      </label>

      {/* Input de fichier caché */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple // Permet la sélection multiple
        className="hidden"
      />

      {/* ZONE DE GLISSER-DÉPOSER */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Icône de dossier */}
          <div className="text-yellow-500 text-3xl">📁</div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-700">Glisser-Déposer ici</span>
            <span className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] px-2.5 py-0.5 rounded font-medium shadow-sm">
              Upload
            </span>
          </div>
        </div>
      </div>

      {/* TABLEAU / LISTE DES FICHIERS */}
      {files.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-bold">
                <th className="p-2">Name</th>
                <th className="p-2 w-24">Fichiers</th>
                <th className="p-2 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">📄</span>
                      <div className="truncate ">
                        <p className="font-semibold text-gray-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {file.type || 'Fichier'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-gray-600 font-medium align-middle">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="p-2 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}