"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export function useAvatarUpload(userId: string | undefined) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail(userId) });
    } catch {
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const openPicker = () => fileInputRef.current?.click();

  return { fileInputRef, uploading, preview, handleChange, openPicker };
}
