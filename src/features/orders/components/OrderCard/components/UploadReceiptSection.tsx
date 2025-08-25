"use client";

import {
  Upload,
  FileCheck,
  FileWarning,
  Loader2,
  Info,
  Banknote,
} from "lucide-react";
import { PaymentMethodType } from "../../../types/order";
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
    <div className="flex flex-col gap-4">
  {/* Info de transferencia */}
  <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-100 border border-yellow-200">
    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
    <p className="text-sm text-gray-700">
      Para confirmar tu compra, sube una foto o PDF del comprobante de transferencia.
    </p>
  </div>

  <button
    onClick={() => setShowTransferInfo(!showTransferInfo)}
    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
  >
    <Banknote className="w-4 h-4" />
    {showTransferInfo ? "Ocultar datos" : "Ver datos para transferir"}
  </button>

  {showTransferInfo && paymentMethods && <TransferDetails paymentMethods={paymentMethods} />}

  {/* Subida de archivo */}
  <div className="flex flex-col gap-2 mt-2">
    <input
      id={`file-input-${orderId}`}
      type="file"
      accept="image/jpeg,image/png,application/pdf"
      className="hidden"
      onChange={onFileChange}
    />
    <label
      htmlFor={`file-input-${orderId}`}
      className="cursor-pointer inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center"
    >
      <Upload className="w-4 h-4" />
      {file ? "Cambiar archivo" : "Subir comprobante"}
    </label>

    {error && (
      <div className="flex items-center gap-2 text-sm text-red-600 p-2 border rounded-lg bg-red-50">
        <FileWarning className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{error}</span>
      </div>
    )}

    {file && (
      <div className="flex items-center justify-between gap-2 text-sm text-gray-600 p-2 border rounded-lg bg-white min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="truncate min-w-0">{file.name}</span>
        </div>
        <button
          onClick={onUpload}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {loading ? "Procesando" : "Subir"}
        </button>
      </div>
    )}
  </div>
</div>

  );
}
