// src/components/TransferPaymentSection.tsx
"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { PaymentStatus, PaymentMethodType } from "../../../types/order";
import { useUpdatePayment } from "../../../hooks/useUpdatePayment";
import { useBusinessPaymentMethods } from "../../../hooks/useBusinessPaymentMethods";
import PaymentStatusSection from "./PaymentStatusSection";
import UploadReceiptSection from "./UploadReceiptSection";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
// Se eliminan los íconos de Chevron

interface Props {
  orderId: string;
  businessId: string;
  paymentStatus: PaymentStatus;
  paymentReceiptUrl?: string | null;
}

export default function TransferPaymentSection({
  orderId,
  businessId,
  paymentStatus,
  paymentReceiptUrl,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showTransferInfo, setShowTransferInfo] = useState(false);
  const updatePaymentMutation = useUpdatePayment();
  const { data: paymentMethods, isError, error } = useBusinessPaymentMethods(businessId);

  const { addAlert } = useAlert()

  useEffect(()=>{
    if(isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: 'error'
      })
    }
  }, [isError, error, addAlert])

  const { canUpload, isPaymentRejected } = useMemo(
    () => ({
      canUpload: paymentStatus === PaymentStatus.PENDING,
      isPaymentRejected: paymentStatus === PaymentStatus.REJECTED,
    }),
    [paymentStatus]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFileError(null);
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return setFile(null);

      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(selectedFile.type)) {
        setFileError(
          "Formato no válido. Sube una imagen (JPEG, PNG) o un PDF."
        );
        return setFile(null);
      }
      if (selectedFile.size > maxSize) {
        setFileError("El archivo es demasiado grande. Máximo 5 MB.");
        return setFile(null);
      }
      setFile(selectedFile);
    },
    []
  );
  const uploadFile = async (file: File) => {
    console.log("Archivo recibido:", file.name); // 👈 usamos la variable para evitar el warning
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return "https://via.placeholder.com/400x200.png?text=comprobante";
  };

  const handleUpload = useCallback(async () => {
    if (!file) return;
    try {
      const uploadedUrl = await uploadFile(file);
      await updatePaymentMutation.mutateAsync({
        orderId,
        payload: {
          paymentStatus: PaymentStatus.IN_PROGRESS,
          paymentReceiptUrl: uploadedUrl,
          paymentHolderName: "",
          paymentType: PaymentMethodType.TRANSFER,
        },
      });
      setFile(null);
      setFileError(null);
    } catch (err) {
      addAlert({
        message: getDisplayErrorMessage(err),
        type: 'error'
      })
      setFileError("Error al procesar el comprobante. Intenta de nuevo.");
    }
  }, [file, orderId, updatePaymentMutation, addAlert]);

  return (
    <div className="mt-4 rounded-xl">
      {/* Estado del pago */}
      <PaymentStatusSection
        status={paymentStatus}
        paymentReceiptUrl={paymentReceiptUrl}
      />

      {/* Subida de comprobante */}
      {(canUpload || isPaymentRejected) && (
        <UploadReceiptSection
          orderId={orderId}
          file={file}
          error={fileError}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          loading={updatePaymentMutation.isPending}
          paymentMethods={paymentMethods ? paymentMethods : undefined }
          showTransferInfo={showTransferInfo}
          setShowTransferInfo={setShowTransferInfo}
        />
      )}
    </div>
  );
}
