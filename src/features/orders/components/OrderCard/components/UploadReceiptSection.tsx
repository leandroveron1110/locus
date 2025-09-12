"use client";

import {
  Upload,
  FileCheck,
  FileWarning,
  Loader2,
  Info,
  Banknote,
} from "lucide-react";
import TransferDetails from "./TransferDetails";

interface Props {
  orderId: string;
  file: File | null;
  error: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  loading: boolean;
  paymentMethods?: any[];
  showTransferInfo: boolean;
  setShowTransferInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UploadReceiptSection({
  orderId,
  file,
  error,
  onFileChange,
  onUpload,
  loading,
  paymentMethods,
  showTransferInfo,
  setShowTransferInfo,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Info de transferencia */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 shadow-sm">
        <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        <p className="text-sm text-gray-700">
          Para confirmar tu compra, sube una foto o PDF del comprobante de transferencia.
        </p>
      </div>

      {/* Botón para ver/ocultar datos */}
      <button
        onClick={() => setShowTransferInfo(!showTransferInfo)}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors shadow-sm"
      >
        <Banknote className="w-5 h-5" />
        {showTransferInfo ? "Ocultar datos" : "Ver datos para transferir"}
      </button>

      {/* Detalles de transferencia */}
      {showTransferInfo && paymentMethods && (
        <div className="mt-2">
          <TransferDetails paymentMethods={paymentMethods} />
        </div>
      )}

      {/* Subida de archivo */}
      <div className="flex flex-col gap-3 mt-2">
        <input
          id={`file-input-${orderId}`}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={onFileChange}
        />

        <label
          htmlFor={`file-input-${orderId}`}
          className="cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center font-medium"
        >
          <Upload className="w-5 h-5" />
          {file ? "Cambiar archivo" : "Subir comprobante"}
        </label>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 p-3 border rounded-lg bg-red-50 shadow-sm">
            <FileWarning className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Archivo seleccionado */}
        {file && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="truncate font-medium min-w-0">{file.name}</span>
            </div>

            <button
              onClick={onUpload}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {loading ? "Procesando" : "Subir"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
