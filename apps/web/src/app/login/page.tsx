import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <section className="bg-paper px-5 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Увійти
          </h1>
          <p className="mt-3 text-ink-soft">
            Продовж планування весілля або керуй заявками як підрядник.
          </p>
        </div>
        <div className="mt-10">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
