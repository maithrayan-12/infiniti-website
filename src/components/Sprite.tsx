/** SVG icon sprite, rendered once in the layout. Reference icons with <Icon name="arrow" />. */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></symbol>
        <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M17 14c2.5 0 4.5 2 4.5 4.5" /></symbol>
        <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></symbol>
        <symbol id="i-layers" viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></symbol>
        <symbol id="i-award" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" /></symbol>
        <symbol id="i-mega" viewBox="0 0 24 24"><path d="M4 10v4h3l8 4V6L7 10H4z" /><path d="M19 9.5c1 .8 1 4.2 0 5" /></symbol>
        <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M21 20H3" /></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></symbol>
        <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></symbol>
        <symbol id="i-cpu" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></symbol>
        <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-8.8-9.4C2.3 7.2 4.4 4.5 7.3 4.5c1.9 0 3.5 1 4.7 2.7 1.2-1.7 2.8-2.7 4.7-2.7 2.9 0 5 2.7 4.1 6.1C19.5 15.4 12 20 12 20z" /></symbol>
        <symbol id="i-bank" viewBox="0 0 24 24"><path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></symbol>
        <symbol id="i-cart" viewBox="0 0 24 24"><path d="M3 4h3l2.4 11h10l2-8H7" /><circle cx="10" cy="19.5" r="1.3" /><circle cx="17" cy="19.5" r="1.3" /></symbol>
        <symbol id="i-factory" viewBox="0 0 24 24"><path d="M3 20V9l6 4V9l6 4V5h4a2 2 0 012 2v13H3z" /><path d="M8 20v-3M13 20v-3M18 20v-3" /></symbol>
        <symbol id="i-truck" viewBox="0 0 24 24"><path d="M2 6h11v10H2zM13 9h4l4 3v4h-8" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></symbol>
        <symbol id="i-phone2" viewBox="0 0 24 24"><path d="M4 13v-1a8 8 0 0116 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19c0 1.5-1.5 2.5-4 2.5" /></symbol>
      </defs>
    </svg>
  );
}

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg className={`ico ${className}`.trim()} aria-hidden="true" focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  );
}
