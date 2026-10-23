"use client";

type Props = {
  id: number;
  value: string;
  options: Record<string, string>;
  action: (formData: FormData) => Promise<void>;
};

// Sélecteur qui soumet le changement de statut dès qu'on le modifie.
export function StatusSelect({ id, value, options, action }: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium"
        aria-label="Statut"
      >
        {Object.entries(options).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </form>
  );
}
