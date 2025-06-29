```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { supabase } from "./lib/supabase"; // Import supabase client

const queryClient = new QueryClient();

const App = () => {
  // Example of fetching data on app load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'your_table_name' with an actual table name from your Supabase project
        // For example, if you have a 'users' table, you can use:
        // const { data, error } = await supabase.from('users').select('*');
        const { data, error } = await supabase.from('modules').select('*'); // Assuming 'modules' is a table in your schema

        if (error) {
          console.error('Error fetching data:', error.message);
        } else {
          console.log('Data fetched successfully:', data);
        }
      } catch (e) {
        console.error('An unexpected error occurred:', e);
      }
    };

    fetchData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
```