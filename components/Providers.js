"use client";
import { AuthProvider } from "@/components/AuthProvider";
import { DogModeProvider, DogDecor } from "@/components/DogMode";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <DogModeProvider>
        <DogDecor />
        {children}
      </DogModeProvider>
    </AuthProvider>
  );
}
