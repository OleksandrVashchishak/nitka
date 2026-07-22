import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <section className="bg-paper px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <RegisterForm />
      </div>
    </section>
  );
}
