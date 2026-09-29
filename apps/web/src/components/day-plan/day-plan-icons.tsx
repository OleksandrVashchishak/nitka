type Props = {
  size?: number;
  className?: string;
};

/** Timeline marker — orange disc with white ring (Figma Timeline marker.svg). */
export function IconTimelineMarker({ size = 16, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="8" cy="8" r="6" fill="#FF4200" stroke="#fff" strokeWidth="4" />
    </svg>
  );
}

/** Mobile timeline marker — r=4 + white stroke 2 (from mobile-day-planning.svg). */
export function IconTimelineMarkerMobile({ size = 10, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="5" cy="5" r="4" fill="#FF4200" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/** Back chevron — mobile header. */
export function IconDayPlanBack({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12.5 15.5 7.5 10.5 12.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pencil edit — Олівець.svg (20×20). */
export function IconDayPlanEdit({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M11.0495 3.00002L4.2078 10.2417C3.94947 10.5167 3.69947 11.0584 3.64947 11.4334L3.34114 14.1333C3.2328 15.1083 3.9328 15.775 4.89947 15.6084L7.5828 15.15C7.9578 15.0834 8.4828 14.8084 8.74114 14.525L15.5828 7.28335C16.7661 6.03335 17.2995 4.60835 15.4578 2.86668C13.6245 1.14168 12.2328 1.75002 11.0495 3.00002Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9082 4.20898C10.2665 6.50898 12.1332 8.26732 14.4499 8.50065"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 18.334H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Plus in circle — primary «Додати подію» button. */
export function IconDayPlanPlus({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="10" cy="10" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.5v7M6.5 10h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Share nodes — Figma mobile «Поділитися». */
export function IconDayPlanShare({ size = 18, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="13.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4.5" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="13.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.2 8.1 11.8 5.4M6.2 9.9 11.8 12.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
