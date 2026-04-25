import { useEffect, useMemo, useRef, useState } from 'react'

type PickedLocation = {
  lat: number
  lng: number
  label: string
}

type NominatimRow = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function buildOsmEmbedUrl(lat: number, lng: number, zoom = 15) {
  // Rough bbox from zoom; keep it simple and stable.
  const span = clamp(0.08 - zoom * 0.0035, 0.01, 0.06)
  const left = lng - span
  const right = lng + span
  const top = lat + span
  const bottom = lat - span
  const bbox = `${left},${bottom},${right},${top}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(
    `${lat},${lng}`,
  )}`
}

export function LocationPickerModal({
  open,
  title = 'Choose location',
  initialQuery = '',
  initialValue,
  onClose,
  onPick,
}: {
  open: boolean
  title?: string
  initialQuery?: string
  initialValue?: PickedLocation | null
  onClose: () => void
  onPick: (loc: PickedLocation) => void
}) {
  const [q, setQ] = useState(initialQuery)
  const [busy, setBusy] = useState(false)
  const [items, setItems] = useState<NominatimRow[]>([])
  const [selected, setSelected] = useState<PickedLocation | null>(initialValue ?? null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!open) return
    setItems([])
    setBusy(false)
    setQ(initialQuery)
    setSelected(initialValue ?? null)
  }, [open, initialQuery, initialValue])

  const embedUrl = useMemo(() => {
    if (!selected) return null
    return buildOsmEmbedUrl(selected.lat, selected.lng, 15)
  }, [selected])

  async function search(next: string) {
    const query = next.trim()
    if (!query) {
      setItems([])
      return
    }
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setBusy(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(query)}`,
        {
          signal: ac.signal,
          headers: {
            Accept: 'application/json',
          },
        },
      )
      if (!res.ok) throw new Error('search failed')
      const data = (await res.json()) as NominatimRow[]
      setItems(Array.isArray(data) ? data : [])
    } catch {
      // ignore
      setItems([])
    } finally {
      setBusy(false)
    }
  }

  function pickFromRow(row: NominatimRow) {
    const lat = Number(row.lat)
    const lng = Number(row.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    setSelected({ lat, lng, label: row.display_name })
    setItems([])
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) return
    setBusy(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
              String(lat),
            )}&lon=${encodeURIComponent(String(lng))}`,
          )
          const data = (await res.json()) as { display_name?: string }
          setSelected({
            lat,
            lng,
            label: data?.display_name || 'My location',
          })
        } catch {
          setSelected({ lat, lng, label: 'My location' })
        } finally {
          setBusy(false)
        }
      },
      () => setBusy(false),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-3 sm:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#070b18]/95 shadow-[0_24px_70px_rgba(2,6,23,0.65)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#080f23]/90 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-white/60">Location</p>
            <h2 className="text-lg font-black text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => {
                  const v = e.target.value
                  setQ(v)
                  // light debounce via timeout-free “type then search” UX
                }}
                placeholder="Search area, venue, city…"
                className="kora-input flex-1 bg-white/5 text-white placeholder:text-white/35"
              />
              <button
                type="button"
                onClick={() => search(q)}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2.5 text-xs font-black text-white shadow-md hover:brightness-105"
              >
                {busy ? '…' : 'Search'}
              </button>
            </div>
            <button
              type="button"
              onClick={useMyLocation}
              className="w-full rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-bold text-white/90 hover:bg-white/10"
            >
              Use my current location
            </button>

            {items.length ? (
              <div className="max-h-56 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-2">
                {items.map((row) => (
                  <button
                    key={row.place_id}
                    type="button"
                    onClick={() => pickFromRow(row)}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/90 hover:bg-white/10"
                  >
                    {row.display_name}
                  </button>
                ))}
              </div>
            ) : null}

            {selected ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-wide text-white/50">Selected</p>
                <p className="mt-1 text-sm font-bold text-white">{selected.label}</p>
                <p className="mt-1 text-xs text-white/60">
                  {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onPick(selected)}
                    className="flex-1 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="flex-1 rounded-2xl border border-white/12 bg-white/5 px-4 py-2.5 text-xs font-black text-white/90 hover:bg-white/10"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/55">Pick a place to see it here.</p>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            {embedUrl ? (
              <iframe
                title="map"
                src={embedUrl}
                className="h-[260px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-[260px] items-center justify-center px-4 text-center text-xs font-semibold text-white/55">
                Select a location to preview the map.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-3">
          <p className="text-center text-[11px] font-semibold text-white/45">
            Location improves recommendations and near-me ranking.
          </p>
        </div>
      </div>
    </div>
  )
}

