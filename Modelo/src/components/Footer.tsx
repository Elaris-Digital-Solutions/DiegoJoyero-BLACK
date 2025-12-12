import { Globe, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const contactDetails = [
  { label: 'Atelier', value: 'Lima, Perú', icon: MapPin },
  { label: 'Teléfono', value: '+51 992 856 599', icon: Phone, href: 'tel:+51992856599' },

  {
    label: 'Trabaja con nosotros',
    value: 'partnersdiegoartesano@gmail.com',
    icon: Mail,
    href: 'mailto:partnersdiegoartesano@gmail.com',
  },
  {
    label: 'Dudas / Reclamos',
    value: 'clientesdiegoartesano@gmail.com',
    icon: Mail,
    href: 'mailto:clientesdiegoartesano@gmail.com',
  },
];

export function Footer() {
  const { theme } = useTheme();

  const networks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/diego.joyero?igshid=ZGNjOWZkYTE3MQ%3D%3D&utm_source=qr',
      icon: Instagram,
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@diego.joyero925?_t=8iIxkY9zR4v&_r=1',
      icon: Globe,
    },
  ];

  return (
    <footer
      id="contact"
      className="border-t"
      style={{ borderColor: 'var(--border)', backgroundColor: theme === 'gold' ? '#f4efe4' : '#f8f8f8' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-[1.2fr,1fr] items-start">
          <div className="space-y-12">
            {/* Logo y tagline */}
            <div className="space-y-6">
              <img src="/assets/Asset-1.svg" alt="Diego Joyero" className="w-32" />
              <p className="text-[0.65rem] uppercase tracking-[0.45em]" style={{ color: 'var(--textSecondary)' }}>
                Maison de joaillerie
              </p>
            </div>

            {/* Descripción principal */}
            <div className="space-y-8 max-w-lg">
              <h3 className="text-2xl font-display leading-relaxed" style={{ color: 'var(--text)' }}>
                Joyas hechas a tu historia
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                Diseñamos piezas únicas a partir de sesiones privadas donde interpretamos tus ideas, memorias o piedras
                heredadas. Cada joya se modela a medida, con bocetos, prototipos y un proceso artesanal que garantiza un
                resultado irrepetible.
              </p>
              <Link
                to="/contacto"
                className="inline-block text-sm uppercase tracking-[0.4em] border-b-2 border-transparent transition-all hover:border-[var(--primary)] pb-1"
                style={{ color: 'var(--primary)' }}
              >
                Agendar una cita personalizada
              </Link>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-10">
            <div className="space-y-2">
              <h3 className="text-2xl font-display" style={{ color: 'var(--text)' }}>
                Contacto directo
              </h3>
              <div className="w-12 h-0.5" style={{ backgroundColor: 'var(--primary)' }}></div>
            </div>
            
            <ul className="space-y-6 text-sm" style={{ color: 'var(--textSecondary)' }}>
              {contactDetails.map(({ label, value, href, icon: Icon }) => (
                <li key={`${label}-${value}`} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'var(--primary)/10' }}>
                    <Icon className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex flex-col text-left space-y-1">
                    <span className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground font-medium">{label}</span>
                    {href ? (
                      <a
                        href={href}
                        className="text-base tracking-[0.02em] transition-colors hover:text-[var(--primary)] leading-relaxed"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-base tracking-[0.02em] leading-relaxed">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Redes sociales */}
            <div className="space-y-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex flex-wrap gap-6">
                {networks.map(({ name, href, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] transition-all hover:scale-105 group"
                    style={{ color: 'var(--primary)' }}
                    aria-label={name}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 group-hover:bg-[var(--primary)] group-hover:text-white transition-all" style={{ borderColor: 'var(--primary)' }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t pt-8 mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--textSecondary)' }}>
          <span className="uppercase tracking-[0.3em]">© 2024 Diego Joyero</span>
          <div className="flex gap-8">
            <a href="#" className="uppercase tracking-[0.2em] hover:text-[var(--text)] transition-colors">Privacidad</a>
            <a href="#" className="uppercase tracking-[0.2em] hover:text-[var(--text)] transition-colors">Términos</a>
            <a href="#" className="uppercase tracking-[0.2em] hover:text-[var(--text)] transition-colors">Garantías</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
