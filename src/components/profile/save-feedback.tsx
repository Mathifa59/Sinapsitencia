"use client";

import { CheckCircle } from "lucide-react";

interface SaveFeedbackProps {
  error: string | null;
  success: boolean;
}

export function SaveFeedback({ error, success }: SaveFeedbackProps) {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
          <CheckCircle className="h-4 w-4" />
          Perfil actualizado correctamente
        </div>
      )}
    </>
  );
}
