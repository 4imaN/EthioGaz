import { RoleSelector } from '@/components/shared/RoleSelector';
import { Fuel } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-5xl w-full">
        <div className="mb-8 flex items-center justify-center space-x-3 animate-fade-in-down">
          <div className="bg-primary/20 p-3 rounded-full">
            <Fuel className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
            EthioGaz
          </h1>
        </div>

        <p className="mb-12 text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-in-up delay-100">
          The smart way to fuel up in Ethiopia. <br className="hidden md:block" />
          Check live queues, find stations, and save time.
        </p>

        <div className="w-full animate-fade-in-up delay-200 flex justify-center">
          <RoleSelector />
        </div>
      </div>
    </main>
  );
}
