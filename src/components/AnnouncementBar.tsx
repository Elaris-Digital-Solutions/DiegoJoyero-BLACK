const announcements = [
  "FREE SHIPPING OVER $150",
  "NEW DROP IS LIVE",
  "BUY 2 GET $10 OFF",
  "LIMITED EDITION PIECES",
];

const AnnouncementBar = () => {
  const repeatedAnnouncements = [...announcements, ...announcements, ...announcements, ...announcements];

  return (
    <div className="bg-foreground text-background py-2.5 overflow-hidden">
      <div className="marquee flex whitespace-nowrap">
        {repeatedAnnouncements.map((text, index) => (
          <span
            key={index}
            className="mx-8 text-xs font-display uppercase tracking-[0.2em]"
          >
            {text} <span className="mx-4">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
