import { CopyInputToClipboard } from "@/components/copy-input-to-clipboard";
import { FeatureCard } from "@/components/feature-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar1, ExternalLink, Globe } from "lucide-react";

export default function Home() {
  const baseEndpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1`;

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <main>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <Badge variant="outline">v1.0.0</Badge>
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground mt-2 mb-6">
                ApiAju
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Uma API pública destinada a oferecer um conjunto de informações
                relacionadas à cidade de Aracaju-SE. Acesse dados sobre a
                capital sergipana de forma simples e eficiente.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <a
                  href="https://docs.api.aju.br"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver Documentação
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="https://www.postman.com/wolneyfo/apiaju/collection/iduur4f/apiaju?action=share&creator=26431734"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Postman
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                O que você pode encontrar
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Calendário"
                description="Listar feriados, verificar se um dia é feriado e contar dias úteis"
                icon={<Calendar1 className="h-6 w-6" />}
              />
              <FeatureCard
                title="Dados Demográficos"
                description="População, densidade e estatísticas da cidade"
                icon={<Globe className="h-6 w-6" />}
                isComingSoon
              />
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Endpoint Base da API
              </h2>
              <p className="text-lg text-gray-600">
                Copie o endpoint base para começar a fazer suas requisições
              </p>
            </div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <CopyInputToClipboard text={baseEndpoint} />
                  <div className="bg-primary-foreground border-l-4 border-primary p-4 rounded-r-lg">
                    <p className="text-primary text-sm">
                      <strong>Exemplo de uso:</strong> GET {baseEndpoint}
                      /health para verificar o status da API
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
