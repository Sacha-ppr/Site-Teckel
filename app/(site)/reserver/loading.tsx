// Page à tâche : pas d'animation décorative, un simple squelette neutre.
export default function Loading() {
  return <div className="mx-auto min-h-[50vh] max-w-[1400px] animate-pulse bg-tirage-2 px-4 py-16 md:px-8" aria-hidden />;
}
