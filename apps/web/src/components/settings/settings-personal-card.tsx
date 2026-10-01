"use client";

import { TextInput } from "@/components/ui/text-input";

type Props = {
  name: string;
  email: string;
  weddingDate: string;
  onNameChange: (value: string) => void;
  onNameBlur: () => void;
  onWeddingDateChange: (value: string) => void;
  onWeddingDateBlur: () => void;
};

export function SettingsPersonalCard({
  name,
  email,
  weddingDate,
  onNameChange,
  onNameBlur,
  onWeddingDateChange,
  onWeddingDateBlur,
}: Props) {
  return (
    <section
      className="cabinet-settings-card"
      aria-labelledby="settings-personal-title"
    >
      <h3 id="settings-personal-title" className="cabinet-settings-card-title">
        Особисті дані
      </h3>
      <div className="cabinet-settings-fields">
        <TextInput
          label="Ім'я"
          size="m"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={onNameBlur}
          autoComplete="name"
          placeholder="Анна"
        />
        <TextInput
          label="Email"
          size="m"
          type="email"
          value={email}
          readOnly
          autoComplete="email"
          placeholder="anna@example.com"
        />
        <TextInput
          label="Дата весілля"
          size="m"
          type="date"
          value={weddingDate}
          onChange={(e) => onWeddingDateChange(e.target.value)}
          onBlur={onWeddingDateBlur}
        />
      </div>
    </section>
  );
}
