import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Loader2, 
  Calendar, 
  CheckCircle2, 
  FileSpreadsheet, 
  Filter 
} from 'lucide-react';

const EDITIONS_CONFIG = [
  {
    id: 'arrivees',
    title: 'Registre des Arrivées',
    description: 'Exporter le registre complet des courriers arrivés sur la période choisie.',
    icon: FileText,
    formats: ['PDF', 'Excel'],
    actionType: 'export'
  },
  {
    id: 'departs',
    title: 'Registre des Départs',
    description: 'Exporter le registre des courriers départ validés et transmis.',
    icon: FileText,
    formats: ['PDF', 'Excel'],
    actionType: 'export'
  },
  {
    id: 'transmission',
    title: 'Bordereau de transmission',
    description: 'Imprimer ou télécharger la fiche récapitulative de remise de courrier.',
    icon: Printer,
    formats: ['PDF', 'Impression'],
    actionType: 'print'
  }
];

function Editions() {
  const [loadingId, setLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Filtres de période
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-18');
  
  // Format sélectionné par édition
  const [selectedFormats, setSelectedFormats] = useState({
    arrivees: 'PDF',
    departs: 'Excel',
    transmission: 'Impression'
  });

  const handleFormatChange = (id, format) => {
    setSelectedFormats((prev) => ({ ...prev, [id]: format }));
  };

  const handleGenerate = async (edition) => {
    setLoadingId(edition.id);
    setSuccessMessage(null);

    const format = selectedFormats[edition.id];

    try {
      // Simulation d'appel API avec filtres
      const payload = {
        editionId: edition.id,
        format: format,
        startDate: startDate,
        endDate: endDate
      };

      console.log('Paramètres d\'édition transmis :', payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage(
        `Génération réussie : ${edition.title} (${format}) pour la période du ${startDate} au ${endDate}.`
      );
    } catch (error) {
      console.error(`Erreur lors de la génération de ${edition.title}:`, error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Éditions & Impressions</h1>
          <p className="text-xs text-gray-500 mt-1">
            Générez et exportez vos registres officiels et bordereaux d'envoi.
          </p>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Barre de sélection de la période */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Période d'édition :</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-500">Du :</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs text-gray-800 font-medium outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-500">Au :</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs text-gray-800 font-medium outline-none"
            />
          </div>
        </div>
      </div>

      {/* Cartes d'éditions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {EDITIONS_CONFIG.map((item) => {
          const Icon = item.icon;
          const isLoading = loadingId === item.id;
          const currentFormat = selectedFormats[item.id];

          return (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-5 hover:border-gray-300 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Choix du format */}
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                    {item.formats.map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => handleFormatChange(item.id, fmt)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                          currentFormat === fmt
                            ? 'bg-white text-blue-600 shadow-xs'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bouton de génération */}
              <button
                onClick={() => handleGenerate(item)}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 active:bg-black text-white disabled:bg-gray-200 disabled:text-gray-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    {currentFormat === 'Impression' ? (
                      <Printer className="w-3.5 h-3.5" />
                    ) : currentFormat === 'Excel' ? (
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Générer ({currentFormat})</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Editions;