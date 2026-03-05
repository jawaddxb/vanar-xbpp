import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout";
import Landing from "./pages/Landing";
import Scenarios from "./pages/Scenarios";
import Matrix from "./pages/Matrix";
import Compare from "./pages/Compare";
import Run from "./pages/Run";
import Diff from "./pages/Diff";
import Summary from "./pages/Summary";
import Export from "./pages/Export";
import Spec from "./pages/Spec";
import PolicyBank from "./pages/PolicyBank";
import TestSuite from "./pages/TestSuite";
import Playground from "./pages/Playground";
import NotFound from "./pages/NotFound";

// Learn pages
import LearnIndex from "./pages/learn/index";
import QuickStart from "./pages/learn/QuickStart";
import ByExample from "./pages/learn/ByExample";
import Concepts from "./pages/learn/Concepts";

// Library pages
import LibraryIndex from "./pages/library/index";
import ReasonCodes from "./pages/library/ReasonCodes";
import Agents from "./pages/library/Agents";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          
          {/* Learn Routes */}
          <Route path="/learn" element={<LearnIndex />} />
          <Route path="/learn/quick-start" element={<QuickStart />} />
          <Route path="/learn/by-example" element={<ByExample />} />
          <Route path="/learn/concepts" element={<Concepts />} />
          
          {/* Library Routes */}
          <Route path="/library" element={<LibraryIndex />} />
          <Route path="/library/policies" element={<PolicyBank />} />
          <Route path="/library/scenarios" element={<Scenarios />} />
          <Route path="/library/reason-codes" element={<ReasonCodes />} />
          <Route path="/library/agents" element={<Agents />} />
          
          {/* Demo Flow */}
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/policies" element={<PolicyBank />} />
          <Route path="/matrix" element={<Matrix />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/run" element={<Run />} />
          <Route path="/diff" element={<Diff />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/export" element={<Export />} />
          
          {/* Playground */}
          <Route path="/playground" element={<Playground />} />
          
          {/* Spec & Tools */}
          <Route path="/spec" element={<Spec />} />
          <Route path="/test-suite" element={<TestSuite />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GrainOverlay />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
