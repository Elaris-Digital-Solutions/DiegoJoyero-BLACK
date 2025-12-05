import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: { pathname: string } } | undefined)?.from?.pathname ?? '/admin';

  if (session) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setError('Ingresa correo y contraseña válidos.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const client = await getSupabaseClient();

      if (!client) {
        setError('Configura las variables de entorno de Supabase para habilitar el acceso.');
        setIsSubmitting(false);
        return;
      }

      const { error: authError } = await client.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (authError) {
        setError(authError.message || 'No se pudo iniciar sesión.');
        setIsSubmitting(false);
        return;
      }

  navigate(redirectTo, { replace: true });
    } catch (authenticationError) {
      console.error('Error al iniciar sesión', authenticationError);
      setError('Ocurrió un problema. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card/80 p-8 shadow-lg">
        <header className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Diego Joyero</p>
          <h1 className="mt-3 text-2xl font-light uppercase tracking-[0.3em]">Panel administrativo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa con las credenciales otorgadas para gestionar el catálogo.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-border/80 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="admin@diegoyoyero.pe"
              autoComplete="email"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-border/80 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/80 bg-foreground px-4 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-background transition-colors hover:bg-foreground/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>

        <footer className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            ¿Olvidaste tus credenciales? Escríbenos desde <Link to="/contacto" className="underline">/contacto</Link>.
          </p>
        </footer>
      </div>
    </div>
  );
}
