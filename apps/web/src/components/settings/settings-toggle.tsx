"use client";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
};

/** Toggle from Content (1).svg / TabProfile (1).svg — 40×20, ON #FF4200, OFF #D7D7D7. */
export function SettingsToggle({
  checked,
  onChange,
  label,
  disabled,
}: Props) {
  return (
    <button
      type="button"
      className={`cabinet-settings-toggle${checked ? " is-on" : ""}${
        disabled ? " is-disabled" : ""
      }`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
    >
      <span className="cabinet-settings-toggle-track" aria-hidden>
        <span className="cabinet-settings-toggle-knob" />
      </span>
    </button>
  );
}
