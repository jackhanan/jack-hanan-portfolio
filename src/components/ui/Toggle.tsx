'use client'

interface Props {
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
  id?: string
}

export default function Toggle({ checked, onChange, label, id }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none" htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-10 h-5 rounded-full transition-colors duration-200 ${
            checked ? 'bg-accent' : 'bg-charcoal/20'
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      {label && <span className="text-sm text-charcoal/70">{label}</span>}
    </label>
  )
}
