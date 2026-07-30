export function guestInviteShareLinks(url: string, guestName: string) {
  const text = `Запрошення на весілля для ${guestName}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const body = encodeURIComponent(`${text}\n\n${url}`);

  return {
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    viber: `viber://forward?text=${body}`,
    whatsapp: `https://wa.me/?text=${body}`,
    mailto: `mailto:?subject=${encodedText}&body=${body}`,
  };
}
