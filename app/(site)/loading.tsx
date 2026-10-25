// Écran de chargement des pages vitrines (home, résidents, bar, ateliers) : une trace de pattes qui s'anime.
// Les pages à tâche (réserver, boutique, compte…) ont leur propre loading.tsx neutre qui prend le pas sur celui-ci.
export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-tirage" aria-hidden>
      <div className="flex flex-col items-center gap-4">
        <div className="trace-pattes flex items-center gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="patte" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <p className="legende text-encre-douce">On rapporte les gamelles…</p>
      </div>
    </div>
  );
}
