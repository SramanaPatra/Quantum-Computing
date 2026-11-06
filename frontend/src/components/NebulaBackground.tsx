// Nebula drifting background blobs + aurora strip
export function NebulaBackground() {
  return (
    <>
      {/* Nebula blobs */}
      <div className="nebula-blob nebula-1" />
      <div className="nebula-blob nebula-2" />
      <div className="nebula-blob nebula-3" />
      <div className="nebula-blob nebula-4" />

      {/* Aurora bar */}
      <div className="aurora-bar" />

      {/* CRT scanlines */}
      <div className="crt-overlay" />
    </>
  );
}
