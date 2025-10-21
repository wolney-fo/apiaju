export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-muted-foreground">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-foreground">ApiAju</span>
            </div>
            <p className="">API pública com informações sobre Aracaju-SE</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="https://docs.api.aju.br" className="hover:underline">
                  Documentação
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/wolney-fo/apiaju"
                  className="hover:underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://stats.uptimerobot.com/haO8gHOOcS/"
                  className="hover:underline"
                  target="_blank"
                >
                  Status dos serviços
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Contato
            </h3>
            <a href="mailto:contato@api.aju.br" className="hover:underline">
              contato@api.aju.br
            </a>
          </div>
        </div>
        <div className="space-y-2 border-t border-muted mt-8 pt-8 text-center text-muted-foreground">
          <p>{currentYear} &copy; ApiAju. Todos os direitos reservados.</p>{" "}
          <p>
            Feito por{" "}
            <a
              href="https://www.wolney.dev"
              target="_blank"
              className="text-primary underline"
            >
              Wolney Oliveira
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
