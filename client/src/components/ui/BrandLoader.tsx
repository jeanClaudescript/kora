export function BrandLoader({ label = 'Loading Kora...' }: { label?: string }) {
  return (
    <div className="kora-loader-wrap" role="status" aria-live="polite">
      <div className="kora-loader-mark">
        <span className="kora-loader-ring" aria-hidden />
        <span className="kora-loader-k">K</span>
      </div>
      <p className="kora-loader-label">{label}</p>
    </div>
  )
}
