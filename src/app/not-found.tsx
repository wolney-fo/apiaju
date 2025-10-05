import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center gap-8 min-h-[70vh]">
      <div className="space-y-2 text-center">
        <h2 className="font-bold text-7xl lg:text-9xl">404</h2>
        <p className="text-xl">Página não encontrada</p>
      </div>
      <Button asChild className="bg-primary">
        <Link href={"/"}>Voltar para o início</Link>
      </Button>
    </main>
  );
}
