import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Download, 
  CheckCircle, 
  FileCheck, 
  X, 
  Loader2, 
  Image as ImageIcon,
  HardDrive
} from 'lucide-react';

// Fonction de formatage d'URL sécurisée
const getFullMediaUrl = (item) => {
  if (!item) return '';
  if (item.url_complete) return item.url_complete;

  let path = item.repertoire_pj || '';
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  path = path.startsWith('/') ? path : `/${path}`;
  if (!path.startsWith('/media/')) path = `/media${path}`;

  return `http://127.0.0.1:8000${path}`;
};

// Fonction de téléchargement via Blob
const handleDownload = async (item) => {
  const fullUrl = getFullMediaUrl(item);
  if (!fullUrl) return;

  const nomOriginal = item.nom_original || 'fichier';

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', nomOriginal);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    console.error('Erreur lors du téléchargement :', error);
    window.open(fullUrl, '_blank');
  }
};

export default function NumerisationPage() {
  const [piecesJointes, setPiecesJointes] = useState([]);
  const [numeroPj, setNumeroPj] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const fetchPiecesJointes = () => {
    fetch('http://127.0.0.1:8000/api/pieces-jointes/')
      .then((res) => res.json())
      .then((data) => setPiecesJointes(Array.isArray(data) ? data : data.results || []))
      .catch((err) => console.error('Erreur BDD :', err));
  };

  useEffect(() => {
    fetchPiecesJointes();
  }, []);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Veuillez sélectionner un fichier.');

    setLoading(true);
    const formData = new FormData();

    if (numeroPj) formData.append('numero_pj', numeroPj);
    formData.append('repertoire_pj', selectedFile);
    formData.append('nom_original', selectedFile.name);
    formData.append('taille', selectedFile.size);
    formData.append('type_mime', selectedFile.type || 'application/octet-stream');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/pieces-jointes/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setNumeroPj('');
        removeSelectedFile();
        fetchPiecesJointes();
      } else {
        alert("Erreur lors de l'enregistrement de la pièce jointe.");
      }
    } catch (error) {
      console.error('Erreur Upload :', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 p-6 text-slate-800">
      
      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Numérisation & Documents</h1>
          <p className="text-xs text-slate-500 mt-1">Gérez, téléversez et archivez vos pièces jointes numérisées.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium">
          <HardDrive className="w-4 h-4 text-slate-500" />
          <span>{piecesJointes.length} document{piecesJointes.length > 1 ? 's' : ''} enregistré{piecesJointes.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Zone de formulaire principal */}
      <form onSubmit={handleUpload} className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Champ Numéro PJ */}
        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Numéro de Pièce Jointe <span className="text-slate-400 font-normal">(Optionnel)</span>
          </label>
          <input
            type="text"
            value={numeroPj}
            onChange={(e) => setNumeroPj(e.target.value)}
            placeholder="Ex: PJ-2026-001"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        {/* Zone Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center ${
            isDragging 
              ? 'border-blue-500 bg-blue-50/60 scale-[0.99]' 
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div className="w-12 h-12 mb-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-slate-900 font-semibold text-sm mb-1">
            Glissez vos fichiers scannés ici ou <button type="button" onClick={() => fileInputRef.current.click()} className="text-blue-600 hover:underline focus:outline-none font-bold">parcourez</button>
          </p>
          <p className="text-slate-400 text-xs">
            PDF, PNG ou JPG (Taille max: 10 Mo)
          </p>

          {/* Fichier sélectionné */}
          {selectedFile && (
            <div className="mt-5 w-full max-w-md bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="text-left truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-400">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeSelectedFile}
                className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                title="Supprimer la sélection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Bouton Enregistrer */}
        {selectedFile && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-medium text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Enregistrer le document</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Galerie des Pièces Jointes */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold tracking-wide uppercase text-slate-500">
          Documents archivés
        </h2>

        {piecesJointes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Aucune pièce jointe enregistrée</p>
            <p className="text-xs text-slate-400">Téléversez vos premiers documents via la zone ci-dessus.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {piecesJointes.map((item, index) => {
              const displayUrl = getFullMediaUrl(item);
              const isImage = item.type_mime?.startsWith('image/') || item.nom_original?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

              return (
                <div 
                  key={item.id || index} 
                  className="group bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Badge / N° PJ */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50/80 border border-blue-100 px-2.5 py-1 rounded-lg">
                        {item.numero_pj ? `N° ${item.numero_pj}` : 'Sans numéro'}
                      </span>
                      {item.taille && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatFileSize(item.taille)}
                        </span>
                      )}
                    </div>

                    {/* Zone d'aperçu */}
                    <div className="relative h-36 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 mb-3 group-hover:bg-slate-100/60 transition">
                      {isImage ? (
                        <img 
                          src={displayUrl} 
                          alt={item.nom_original} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                          <div className="p-3 bg-white text-slate-500 rounded-xl shadow-xs border border-slate-100">
                            <FileText className="w-8 h-8 text-blue-600" />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Document PDF / SCAN
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Nom du fichier */}
                    <p className="text-xs font-semibold text-slate-700 truncate mb-4 px-0.5" title={item.nom_original}>
                      {item.nom_original || 'Document sans titre'}
                    </p>
                  </div>

                  {/* Action Télécharger */}
                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}