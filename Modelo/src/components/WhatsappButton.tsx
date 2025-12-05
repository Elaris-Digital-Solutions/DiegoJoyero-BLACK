import { MessageCircle } from 'lucide-react';

export function WhatsappButton() {
  return (
    <a
      href="https://wa.me/51992856599"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 border transition-colors duration-300 hover:bg-[rgba(0,0,0,0.04)]"
      style={{
        backgroundColor: 'transparent',
        color: 'var(--primary)',
        borderColor: 'var(--primary)',
      }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
