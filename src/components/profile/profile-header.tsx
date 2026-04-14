"use client";

import { Loader2, Camera, Mail } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { ReactNode, RefObject, ChangeEventHandler } from "react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl: string | null;
  /** Gradient CSS class for the banner (e.g. "from-blue-600 via-blue-500 to-cyan-500") */
  bannerGradient: string;
  /** Fallback background class for the avatar (e.g. "bg-blue-600") */
  avatarFallbackClass: string;
  /** Badges and extra info rendered below the name */
  badges?: ReactNode;
  /** Avatar upload */
  fileInputRef: RefObject<HTMLInputElement | null>;
  uploading: boolean;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  onPickerOpen: () => void;
}

export function ProfileHeader({
  name,
  email,
  avatarUrl,
  bannerGradient,
  avatarFallbackClass,
  badges,
  fileInputRef,
  uploading,
  onFileChange,
  onPickerOpen,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`h-28 bg-gradient-to-r ${bannerGradient}`} />
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
          {/* Avatar con upload */}
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
              <AvatarFallback className={`${avatarFallbackClass} text-white text-2xl font-bold`}>
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={onPickerOpen}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <h2 className="text-xl font-bold text-slate-900 truncate">{name}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5" />
              {email}
            </div>
            {badges && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">{badges}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
