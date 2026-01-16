import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Met à jour l'état pour que le prochain rendu affiche l'UI de secours.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Tu peux envoyer l'erreur à un service comme Sentry ici
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  
  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-10 text-center bg-stone-50 border border-stone-100 m-4">
          <h2 className="font-playfair italic text-2xl text-stone-800 mb-4">
            Oops! Algo salió mal.
          </h2>
          <p className="font-oswald text-xs uppercase tracking-widest text-stone-500 mb-8">
            Hubo un error al cargar esta sección.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-stone-900 text-white font-oswald text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;