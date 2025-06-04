import { ThemeToggleButton } from "@/components/ThemeToggleButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p>Bienvenue !</p>
        <ThemeToggleButton />
      </div>
    </main>
  );
}