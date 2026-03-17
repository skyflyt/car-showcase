"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TRANSITION_EFFECTS } from "@/lib/types";
import type { TransitionEffect, ImageEntry } from "@/lib/types";

interface CarFormData {
  id?: string;
  slug?: string;
  year: number;
  make: string;
  model: string;
  subtitle: string;
  color: string;
  heroImage: string;
  description: string;
  story: string;
  stats: Record<string, string>;
  highlights: string[];
  auctionInfo: {
    house: string;
    event: string;
    lot: string;
    soldPrice: string;
    chassis: string;
  } | null;
  images: string[];
  imageSettings: ImageEntry[];
  defaultTransition: string;
  storyDismissSeconds: number;
  slideshowIntervalMs: number;
  statsExpanded: boolean;
  displayMode: string;
}

const DEFAULT_STATS = {
  engine: "",
  horsepower: "",
  torque: "",
  zeroToSixty: "",
  topSpeed: "",
  transmission: "",
  weight: "",
  production: "",
};

const emptyForm: CarFormData = {
  year: new Date().getFullYear(),
  make: "",
  model: "",
  subtitle: "",
  color: "",
  heroImage: "",
  description: "",
  story: "",
  stats: { ...DEFAULT_STATS },
  highlights: [],
  auctionInfo: null,
  images: [],
  imageSettings: [],
  defaultTransition: "fade",
  storyDismissSeconds: 30,
  slideshowIntervalMs: 6000,
  statsExpanded: false,
  displayMode: "interactive",
};

interface Props {
  initialData?: CarFormData;
  isEdit?: boolean;
}

export function AdminCarForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CarFormData>(initialData || emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [showAuction, setShowAuction] = useState(!!initialData?.auctionInfo);
  const [activeSection, setActiveSection] = useState("basic");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingImageIdx, setEditingImageIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = (url: string) =>
    /\.(mp4|webm|mov|avi|mkv|m4v|ogv)(\?|$)/i.test(url);

  const sections = [
    { key: "basic", label: "Basic Info" },
    { key: "media", label: "Media" },
    { key: "specs", label: "Specifications" },
    { key: "story", label: "Story & Description" },
    { key: "highlights", label: "Highlights" },
    { key: "auction", label: "Auction / Provenance" },
    { key: "settings", label: "Display Settings" },
  ];

  const updateField = <K extends keyof CarFormData>(
    key: K,
    value: CarFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateStat = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, stats: { ...prev.stats, [key]: value } }));
  };

  // Get/set image settings helper
  const getImageSetting = (index: number): ImageEntry => {
    return form.imageSettings[index] || { url: form.images[index] };
  };

  const updateImageSetting = (index: number, updates: Partial<ImageEntry>) => {
    setForm((prev) => {
      const newSettings = [...prev.imageSettings];
      // Ensure array is long enough
      while (newSettings.length <= index) {
        newSettings.push({ url: prev.images[newSettings.length] || "" });
      }
      newSettings[index] = { ...newSettings[index], ...updates };
      return { ...prev, imageSettings: newSettings };
    });
  };

  const addImage = () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) return;
    const urls = trimmed
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
      imageSettings: [
        ...prev.imageSettings,
        ...urls.map((url) => ({ url })),
      ],
      heroImage: prev.heroImage || urls[0],
    }));
    setImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { urls } = await res.json();
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
        imageSettings: [
          ...prev.imageSettings,
          ...urls.map((url: string) => ({ url })),
        ],
        heroImage: prev.heroImage || urls[0],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newSettings = prev.imageSettings.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        imageSettings: newSettings,
        heroImage:
          prev.heroImage === prev.images[index]
            ? newImages[0] || ""
            : prev.heroImage,
      };
    });
    if (editingImageIdx === index) setEditingImageIdx(null);
  };

  const setAsHero = (url: string) => {
    updateField("heroImage", url);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= form.images.length) return;
    setForm((prev) => {
      const newImages = [...prev.images];
      const [moved] = newImages.splice(from, 1);
      newImages.splice(to, 0, moved);
      const newSettings = [...prev.imageSettings];
      const [movedSetting] = newSettings.splice(from, 1);
      if (movedSetting) newSettings.splice(to, 0, movedSetting);
      return { ...prev, images: newImages, imageSettings: newSettings };
    });
  };

  const addHighlight = () => {
    const trimmed = newHighlight.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, trimmed],
    }));
    setNewHighlight("");
  };

  const removeHighlight = (index: number) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!form.make || !form.model) {
      setError("Make and Model are required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const url = isEdit ? `/api/cars/${form.id}` : "/api/cars";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    setSaving(true);
    try {
      await fetch(`/api/cars/${form.id}`, { method: "DELETE" });
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Failed to delete");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeSection === s.key
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      {activeSection === "basic" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Year
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => updateField("year", parseInt(e.target.value))}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Make
              </label>
              <input
                type="text"
                value={form.make}
                onChange={(e) => updateField("make", e.target.value)}
                className="admin-input"
                placeholder="Lamborghini"
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Model
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => updateField("model", e.target.value)}
                className="admin-input"
                placeholder="Revent\u00f3n"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="admin-input"
                placeholder="Coupe \u2014 #12 of 20"
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Color
              </label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => updateField("color", e.target.value)}
                className="admin-input"
                placeholder="Grigio Revent\u00f3n"
              />
            </div>
          </div>
        </div>
      )}

      {/* Media */}
      {activeSection === "media" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">
            Media
            <span className="text-white/30 text-sm font-light ml-3">
              {form.images.length} items
            </span>
          </h2>

          {/* Upload from computer */}
          <div className="flex gap-3 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="admin-btn admin-btn-primary flex items-center gap-2"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>Upload Media</>
              )}
            </button>
            <span className="text-white/30 text-xs">
              Select images or videos from your computer
            </span>
          </div>

          {/* Or add by URL */}
          <div className="flex gap-3">
            <textarea
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="admin-input flex-1"
              placeholder="Or paste image URL(s) \u2014 one per line for bulk add"
              rows={2}
            />
            <button onClick={addImage} className="admin-btn admin-btn-secondary self-end">
              Add URL
            </button>
          </div>

          {/* Media grid */}
          <div className="grid grid-cols-4 gap-3">
            {form.images.map((url, i) => {
              const setting = getImageSetting(i);
              const hasSettings = setting.transition || setting.caption;
              const videoFile = isVideo(url);
              return (
                <div key={i} className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-white/5">
                  {videoFile ? (
                    <video
                      src={url}
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                      muted
                      playsInline
                      preload="metadata"
                      onClick={() => setPreviewImage(url)}
                    />
                  ) : (
                    <Image
                      src={url}
                      alt={`Media ${i + 1}`}
                      fill
                      className="object-cover cursor-pointer"
                      unoptimized
                      onClick={() => setPreviewImage(url)}
                    />
                  )}
                  {/* Video badge */}
                  {videoFile && (
                    <div className="absolute top-2 left-2 bg-purple-500/70 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded z-10">
                      Video
                    </div>
                  )}
                  {/* Hero badge */}
                  {url === form.heroImage && (
                    <div className="absolute top-2 left-2 bg-white/90 text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Hero
                    </div>
                  )}
                  {/* Index + settings indicator */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {hasSettings && (
                      <div className="bg-blue-500/60 text-white text-[10px] px-1.5 py-0.5 rounded" title="Has custom settings">
                        {setting.caption ? "T" : ""}{setting.transition ? "A" : ""}
                      </div>
                    )}
                    <div className="bg-black/60 text-white/60 text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {i + 1}
                    </div>
                  </div>
                  {/* Controls overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingImageIdx(editingImageIdx === i ? null : i); }}
                      className="text-xs bg-blue-500/30 hover:bg-blue-500/50 px-2 py-1 rounded"
                      title="Edit settings"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewImage(url); }}
                      className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                    >
                      View
                    </button>
                    {url !== form.heroImage && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setAsHero(url); }}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                      >
                        Hero
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); moveImage(i, i - 1); }}
                      className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                      disabled={i === 0}
                    >
                      &larr;
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveImage(i, i + 1); }}
                      className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                      disabled={i === form.images.length - 1}
                    >
                      &rarr;
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="text-xs bg-red-500/40 hover:bg-red-500/60 px-2 py-1 rounded"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Per-image settings editor */}
          {editingImageIdx !== null && editingImageIdx < form.images.length && (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/70">
                  Media {editingImageIdx + 1} Settings
                </h3>
                <button
                  onClick={() => setEditingImageIdx(null)}
                  className="text-white/30 hover:text-white/60 text-sm"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                    Transition Effect
                  </label>
                  <select
                    value={getImageSetting(editingImageIdx).transition || ""}
                    onChange={(e) =>
                      updateImageSetting(editingImageIdx, {
                        transition: (e.target.value || undefined) as TransitionEffect | undefined,
                      })
                    }
                    className="admin-input"
                  >
                    <option value="">Use default ({form.defaultTransition})</option>
                    {TRANSITION_EFFECTS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                    Caption / About This Image
                  </label>
                  <input
                    type="text"
                    value={getImageSetting(editingImageIdx).caption || ""}
                    onChange={(e) =>
                      updateImageSetting(editingImageIdx, {
                        caption: e.target.value || undefined,
                      })
                    }
                    className="admin-input"
                    placeholder="e.g. Rear 3/4 view showing the F-22 inspired design..."
                  />
                  <p className="text-white/20 text-xs mt-1">
                    Shows as a sleek overlay bubble on the image during slideshow
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview Modal */}
          {previewImage && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8 cursor-pointer"
              onClick={() => setPreviewImage(null)}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-6 right-8 text-white/60 hover:text-white text-3xl font-light z-10"
              >
                &times;
              </button>
              {form.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = form.images.indexOf(previewImage);
                      const prevIdx = (idx - 1 + form.images.length) % form.images.length;
                      setPreviewImage(form.images[prevIdx]);
                    }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center"
                  >
                    &lsaquo;
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = form.images.indexOf(previewImage);
                      const nextIdx = (idx + 1) % form.images.length;
                      setPreviewImage(form.images[nextIdx]);
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center"
                  >
                    &rsaquo;
                  </button>
                </>
              )}
              <div className="relative w-full h-full max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                {isVideo(previewImage) ? (
                  <video
                    src={previewImage}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                  />
                ) : (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                )}
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm">
                {form.images.indexOf(previewImage) + 1} / {form.images.length}
                {previewImage === form.heroImage && (
                  <span className="ml-3 text-white/60 uppercase text-xs tracking-wider">Hero Image</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Specifications */}
      {activeSection === "specs" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(DEFAULT_STATS).map(([key]) => (
              <div key={key}>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type="text"
                  value={form.stats[key] || ""}
                  onChange={(e) => updateStat(key, e.target.value)}
                  className="admin-input"
                  placeholder={key === "engine" ? "6.5L V-12" : ""}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Story & Description */}
      {activeSection === "story" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Story & Description</h2>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
              Description (short \u2014 shown in stats area)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="admin-input"
              rows={4}
              placeholder="Brief description of the vehicle..."
            />
          </div>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
              Story (long \u2014 shown in slide-out panel)
            </label>
            <textarea
              value={form.story}
              onChange={(e) => updateField("story", e.target.value)}
              className="admin-input"
              rows={12}
              placeholder="The full story of this vehicle. Use blank lines to separate paragraphs..."
            />
            <p className="text-white/20 text-xs mt-2">
              Separate paragraphs with blank lines. This content appears in the
              story panel overlay.
            </p>
          </div>
        </div>
      )}

      {/* Highlights */}
      {activeSection === "highlights" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Highlights</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHighlight()}
              className="admin-input flex-1"
              placeholder="Add a highlight point..."
            />
            <button onClick={addHighlight} className="admin-btn admin-btn-primary">
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {form.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 group"
              >
                <span className="text-white/20">&#9670;</span>
                <span className="flex-1 text-sm text-white/70">{h}</span>
                <button
                  onClick={() => removeHighlight(i)}
                  className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Auction / Provenance */}
      {activeSection === "auction" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Auction / Provenance</h2>
            <button
              onClick={() => {
                setShowAuction(!showAuction);
                if (!showAuction) {
                  updateField("auctionInfo", {
                    house: "",
                    event: "",
                    lot: "",
                    soldPrice: "",
                    chassis: "",
                  });
                } else {
                  updateField("auctionInfo", null);
                }
              }}
              className="admin-btn admin-btn-secondary text-sm"
            >
              {showAuction ? "Remove" : "Add Auction Info"}
            </button>
          </div>
          {showAuction && form.auctionInfo && (
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  ["house", "Auction House"],
                  ["event", "Event"],
                  ["lot", "Lot Number"],
                  ["soldPrice", "Sold Price"],
                  ["chassis", "Chassis / VIN"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={form.auctionInfo?.[key] || ""}
                    onChange={(e) =>
                      updateField("auctionInfo", {
                        ...form.auctionInfo!,
                        [key]: e.target.value,
                      })
                    }
                    className="admin-input"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Display Settings */}
      {activeSection === "settings" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Default Mode
              </label>
              <select
                value={form.displayMode}
                onChange={(e) => updateField("displayMode", e.target.value)}
                className="admin-input"
              >
                <option value="interactive">Interactive (iPad / Kiosk)</option>
                <option value="display">Display (Passive Screen)</option>
              </select>
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Default Transition Effect
              </label>
              <select
                value={form.defaultTransition}
                onChange={(e) => updateField("defaultTransition", e.target.value)}
                className="admin-input"
              >
                {TRANSITION_EFFECTS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="text-white/20 text-xs mt-1">
                Applied to all media unless overridden per-item
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Slideshow Interval (ms)
              </label>
              <input
                type="number"
                value={form.slideshowIntervalMs}
                onChange={(e) =>
                  updateField("slideshowIntervalMs", parseInt(e.target.value))
                }
                className="admin-input"
                step={1000}
                min={2000}
              />
              <p className="text-white/20 text-xs mt-1">
                {(form.slideshowIntervalMs / 1000).toFixed(0)}s between slides
              </p>
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Story Auto-Dismiss (seconds)
              </label>
              <input
                type="number"
                value={form.storyDismissSeconds}
                onChange={(e) =>
                  updateField("storyDismissSeconds", parseInt(e.target.value))
                }
                className="admin-input"
                min={10}
                max={120}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.statsExpanded}
                onChange={(e) => updateField("statsExpanded", e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-white accent-white/80"
              />
              <div>
                <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                  Start with specs expanded
                </span>
                <p className="text-white/30 text-xs mt-0.5">
                  Show all specification fields by default instead of the first 5
                </p>
              </div>
            </label>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-white/5 text-sm text-white/40">
            <p className="font-semibold text-white/60 mb-2">Transition Reference:</p>
            <p className="mb-1"><strong className="text-white/50">Fade</strong> — Simple crossfade between images.</p>
            <p className="mb-1"><strong className="text-white/50">Zoom In / Out</strong> — Slow Ken Burns-style zoom during display.</p>
            <p className="mb-1"><strong className="text-white/50">Pan Left / Right</strong> — Slow horizontal camera pan across the image.</p>
            <p className="mb-1"><strong className="text-white/50">Slide Left / Right</strong> — Image slides in from the side.</p>
            <p><strong className="text-white/50">Ken Burns</strong> — Randomly picks zoom/pan each slide for a cinematic feel.</p>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-white/5 text-sm text-white/40">
            <p className="font-semibold text-white/60 mb-2">Mode Reference:</p>
            <p className="mb-1">
              <strong className="text-white/50">Interactive</strong> — For iPad
              kiosks. Users can tap to navigate slides and open the story panel.
            </p>
            <p>
              <strong className="text-white/50">Display</strong> — For passive
              screens. No touch interaction. Slideshow auto-cycles and the story
              panel appears periodically then auto-dismisses.
            </p>
          </div>
        </div>
      )}

      {/* Save bar */}
      <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
        <div>
          {isEdit && (
            <button
              onClick={handleDelete}
              className="admin-btn admin-btn-danger text-sm"
              disabled={saving}
            >
              Delete Car
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin")}
            className="admin-btn admin-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="admin-btn admin-btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Car"}
          </button>
        </div>
      </div>
    </div>
  );
}
