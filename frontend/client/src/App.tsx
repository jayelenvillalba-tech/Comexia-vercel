import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import TradeFlow from "@/pages/trade-flow";
import CompanyMap from "@/pages/company-map";
import Analysis from "@/pages/analysis";
import SouthAmericaAnalysis from "@/pages/south-america-analysis";
import ExpansionDashboard from "@/pages/expansion-dashboard";
import Marketplace from "@/pages/marketplace";
import AdminDashboard from "@/pages/admin-dashboard";
import CompanyProfile from "@/pages/company-profile";
import ChatPage from "@/pages/chat";
import ChatConversationPage from "@/pages/chat-conversation";
import JoinChat from "@/pages/join-chat";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Algo salió mal</h1>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 max-w-2xl w-full overflow-auto">
            <p className="font-mono text-sm text-red-400 mb-2">{this.state.error?.toString()}</p>
            <pre className="font-mono text-xs text-slate-400 whitespace-pre-wrap">
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          <button 
            className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/'}
          >
            Volver al Inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trade-flow" component={TradeFlow} />
      <Route path="/company-map" component={CompanyMap} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/south-america" component={SouthAmericaAnalysis} />
      <Route path="/expansion-dashboard" component={ExpansionDashboard} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/company/:id" component={CompanyProfile} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/chat/:id" component={ChatConversationPage} />
      <Route path="/join-chat/:token" component={JoinChat} />
      <Route path="/landing" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
