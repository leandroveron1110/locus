// src/app/providers.tsx
"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient"; 
import { AlertProvider } from "@/features/common/ui/Alert/Alert";
import { usePushSubscription } from "@/lib/hooks/usePushSubscription";


function PushSubscriptionManager() {
    usePushSubscription();
    return null; 
}


export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AlertProvider>
                <PushSubscriptionManager /> 
                {children}
            </AlertProvider>
        </QueryClientProvider>
    );
}