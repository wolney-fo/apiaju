import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <article className="text-lg">
        <h1 className="font-bold text-2xl mb-4">
          Erro 404 - Página não encontrada
        </h1>

        <p>Ops! A página que você está procurando não existe.</p>
        <p>
          Retorne para a{" "}
          <Link className="text-blue-800 hover:underline" href="/">
            página inicial
          </Link>
          .
        </p>
      </article>
    </main>
  );
}
