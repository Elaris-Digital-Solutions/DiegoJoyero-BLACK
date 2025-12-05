import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase';

interface AuthContextValue {
	session: Session | null;
	user: User | null;
	loading: boolean;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const clientRef = useRef<SupabaseClient | null>(null);

	useEffect(() => {
		let isMounted = true;
		let unsubscribe: (() => void) | null = null;

		const load = async () => {
			const client = await getSupabaseClient();
			if (!isMounted) {
				return;
			}

			clientRef.current = client;

			if (!client) {
				setSession(null);
				setLoading(false);
				return;
			}

			try {
				const { data } = await client.auth.getSession();
				if (!isMounted) return;
				setSession(data.session ?? null);
				setLoading(false);
			} catch (error) {
				console.error('No se pudo recuperar la sesión de Supabase', error);
				if (!isMounted) return;
				setSession(null);
				setLoading(false);
			}

			const { data: subscription } = client.auth.onAuthStateChange((_event, newSession) => {
				setSession(newSession ?? null);
				setLoading(false);
			});
			unsubscribe = () => subscription.subscription.unsubscribe();
		};

		void load();

		return () => {
			isMounted = false;
			unsubscribe?.();
		};
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			session,
			user: session?.user ?? null,
			loading,
			signOut: async () => {
				if (!clientRef.current) return;
				await clientRef.current.auth.signOut();
			},
		}),
		[loading, session]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe usarse dentro de un AuthProvider');
	}
	return context;
}
