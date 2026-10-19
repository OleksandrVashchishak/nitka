import { Button } from "@/components/ui/button";
import "@/styles/landing/service.scss";

export function VesilnyyPlanPage() {
  return (
    <div className="fata-service-hero">
      <div className="fata-service-hero__main">
        <div className="fata-service-hero__copy">
          <p className="fata-service-hero__eyebrow">FATA.STUDIO • ЗАВДАННЯ</p>
          <h1 className="fata-service-hero__title">
            План весілля онлайн: список завдань без хаосу
          </h1>
          <p className="fata-service-hero__lead">
            Забудьте про хаотичне планування. Fata.studio — це сучасний
            український весільний пленер, який формує персональний список
            справ за 3 кроки, допомагає розподіляти обов&rsquo;язки та тримає
            дедлайни під контролем.
          </p>
          <div className="fata-service-hero__actions">
            <Button href="/register" tone="dark" size="l">
              Спробувати безкоштовно
            </Button>
            <Button href="/login" tone="outline" size="l">
              Увійти
            </Button>
          </div>
        </div>

        <div className="fata-service-hero__media">
          <div className="fata-service-hero__media-placeholder">
            місце під зображення
          </div>
        </div>
      </div>
    </div>
  );
}
