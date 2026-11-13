"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { GallerySet } from "@/lib/work/gallery";

const noopSubscribe = () => () => {};

/**
 * Thumbnails for one design set, plus a full-size viewer.
 * The viewer renders into <body>: the page-transition wrapper applies a transform,
 * which would otherwise pin this `position: fixed` layer to the page, not the screen.
 */
export default function GalleryGrid({ set }: { set: GallerySet }) {
  const [index, setIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const close = useCallback(() => {
    const opener = index;
    setIndex(null);
    // Hand focus back to the thumbnail that opened the viewer.
    if (opener !== null) setTimeout(() => triggers.current[opener]?.focus(), 0);
  }, [index]);

  const { images, layout } = set;

  const grid =
    layout === "phone"
      ? "grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5"
      : layout === "board"
        ? "grid"
        : "grid gap-4 sm:grid-cols-2";

  return (
    <>
      <ul className={grid}>
        {images.map((image, i) => {
          const tile =
            layout === "phone"
              ? "aspect-[9/16]"
              : layout === "board"
                ? "aspect-[4/3] sm:aspect-[16/10]"
                : i === 0
                  ? "aspect-[16/10] sm:col-span-2"
                  : "aspect-[4/3]";
          return (
            <li key={image.src} className={layout === "screen" && i === 0 ? "sm:col-span-2" : undefined}>
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                onClick={() => setIndex(i)}
                className="group block w-full text-left"
                aria-label={`View “${image.caption}” full size`}
              >
                <span className={`relative block overflow-hidden rounded-xl bg-surface ring-1 ring-border ring-inset ${tile}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={layout === "phone" ? "(min-width: 1024px) 200px, 33vw" : layout === "board" ? "(min-width: 1024px) 1100px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                    className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.02]"
                  />
                  {layout === "board" && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-background px-3 py-1.5 text-caption font-medium shadow-[0_0_0_1px_var(--color-border)]">
                      View full board
                    </span>
                  )}
                </span>
                <span className="mt-2 block text-caption leading-snug text-muted transition-colors group-hover:text-foreground">
                  {image.caption}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {isClient && index !== null && createPortal(<Viewer set={set} index={index} onIndex={setIndex} onClose={close} />, document.body)}
    </>
  );
}

function Viewer({ set, index, onIndex, onClose }: { set: GallerySet; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const image = set.images[index];
  const count = set.images.length;
  const [zoomed, setZoomed] = useState(false);
  const [viewport, setViewport] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset zoom and scroll when the image changes (adjusting state during render).
  const [shown, setShown] = useState(index);
  if (shown !== index) {
    setShown(index);
    setZoomed(false);
  }

  const go = useCallback((d: number) => onIndex((index + d + count) % count), [index, count, onIndex]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
  }, [index, zoomed]);

  // Lock page scroll, focus the dialog, and track the width available for "fit".
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const measure = () => setViewport(scrollRef.current?.clientWidth ?? window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && count > 1) go(1);
      else if (e.key === "ArrowLeft" && count > 1) go(-1);
      else if (e.key === "Tab") {
        // Keep focus inside the dialog.
        const f = dialogRef.current?.querySelectorAll<HTMLElement>('button, [tabindex="0"]');
        if (!f || f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose, count]);

  const pad = 32;
  const fitWidth = Math.min(image.width, Math.max(0, viewport - pad));
  const canZoom = viewport > 0 && image.width > fitWidth + 40;
  const width = zoomed ? image.width : fitWidth || undefined;
  const btn = "inline-flex min-h-10 items-center rounded-lg px-3 text-sm ring-1 ring-inset ring-background/30 hover:bg-background/10 focus-visible:outline-background";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${set.title}: ${image.caption}`}
      className="fixed inset-0 z-[100] flex flex-col bg-foreground text-background"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <p className="min-w-0 text-sm">
          <span className="font-medium">{image.caption}</span>
          <span className="ml-2 font-mono text-xs tabular-nums opacity-80">
            {index + 1} / {count}
          </span>
        </p>
        <div className="flex items-center gap-2">
          {canZoom && (
            <button type="button" onClick={() => setZoomed((z) => !z)} aria-pressed={zoomed} className={btn}>
              {zoomed ? "Fit to screen" : "Actual size"}
            </button>
          )}
          {count > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous screen" className={btn}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M11 18l-6-6 6-6" />
                </svg>
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next screen" className={btn}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}
          <button ref={closeRef} type="button" onClick={onClose} className={`${btn} font-medium`}>
            Close
          </button>
        </div>
      </div>

      {/* data-lenis-prevent: let this panel scroll natively instead of the smooth-scrolled page. */}
      {/* Focusable so keyboard users can scroll tall boards with the arrow and page keys. */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        tabIndex={0}
        aria-label={`${image.caption}, scrollable`}
        className="flex-1 overflow-auto overscroll-contain px-4 pb-6 focus-visible:outline-background sm:px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="mx-auto" style={{ width }}>
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={zoomed ? `${image.width}px` : `${Math.round(fitWidth) || image.width}px`}
            priority
            className="h-auto w-full rounded-md bg-background"
          />
          <p className="mx-auto mt-3 max-w-[70ch] text-center text-caption leading-relaxed opacity-80">{image.alt}</p>
        </div>
      </div>
    </div>
  );
}
