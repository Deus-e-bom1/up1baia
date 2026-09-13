import { AlertTriangle, ChevronRight, CircleAlert, PackageCheck, Settings, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import logoUrl from "@/assets/casas-bahia-logo.svg";
import { Button } from "@/components/ui/button";

type AnalysisStage = 0 | 1 | 2 | 3 | 4 | 5;

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stage, setStage] = useState<AnalysisStage>(0);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const startAnalysis = () => {
    timers.current.forEach(clearTimeout);
    setIsAnalyzing(true);
    setStage(0);

    const schedule = (nextStage: AnalysisStage, delay: number) => {
      timers.current.push(setTimeout(() => setStage(nextStage), delay));
    };

    schedule(1, 1500);
    schedule(2, 3700);
    schedule(3, 5900);
    schedule(4, 8200);
    schedule(5, 10400);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen w-full max-w-[430px] border-x border-transparent bg-background sm:border-border">
        <header className="flex h-[58px] items-center justify-between px-5">
          <img className="h-auto w-[197px]" src={logoUrl} alt="Casas Bahia" />
          <ShoppingCart className="size-6 stroke-[2.3] text-header-icon" aria-label="Carrinho" />
        </header>

        {!isAnalyzing ? (
          <section className="px-5 pt-3" aria-labelledby="orders-title">
            <h1 id="orders-title" className="text-[17px] font-semibold text-heading">
              Seus pedidos
            </h1>

            <article className="mt-6 rounded-[15px] bg-panel p-6 pt-5">
              <div className="flex items-center justify-between">
                <span className="flex size-[54px] items-center justify-center rounded-full bg-status-header text-status-header-foreground">
                  <PackageCheck className="size-7" aria-hidden="true" />
                </span>
                <strong className="text-[16px] font-semibold text-heading">#6481749338</strong>
              </div>

              <div className="mt-5 overflow-hidden rounded-[10px] bg-surface shadow-status">
                <div className="bg-status-header px-4 py-3 text-[15px] font-semibold text-status-header-foreground">
                  Status
                </div>
                <div className="flex items-center gap-3 px-4 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning text-warning-foreground">
                    <span className="text-xl leading-none">✓</span>
                  </span>
                  <span className="text-[14px] font-semibold text-heading">Pagamento concluído</span>
                </div>
                <div className="flex items-center gap-3 px-4 pb-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-danger text-danger-foreground">
                    <AlertTriangle className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-[14px] font-semibold text-heading">Pendência no pedido</span>
                </div>
              </div>

              <p className="mx-auto mt-5 max-w-[328px] text-center text-[14px] font-bold leading-[1.2] text-body-copy">
                Seu pagamento foi concluído com sucesso, porém foi encontrada uma pendência no seu pedido. Clique abaixo para resolver esse problema!
              </p>

              <Button variant="action" size="order" className="pulse-btn mt-5 w-full justify-between" onClick={startAnalysis}>
                Resolver problema
                <ChevronRight className="size-7 stroke-[3]" aria-hidden="true" />
              </Button>
            </article>
          </section>
        ) : (
          <section className="px-5 pt-3" aria-labelledby="problems-title">
            <h1 id="problems-title" className="text-[17px] font-semibold text-heading">
              Problemas no pedido
            </h1>

            <div className="mt-6 min-h-[528px] rounded-[15px] bg-panel p-5">
              <div className="space-y-4" aria-live="polite">
                {stage >= 1 && (
                  <StatusMessage tone="warning" icon={<Settings className="size-5" />}>
                    Estamos identificando o<br /> problema no seu pedido!
                  </StatusMessage>
                )}

                {stage >= 2 && (
                  <StatusMessage tone="danger" icon={<AlertTriangle className="size-5" />}>
                    Identificamos que existe uma<br /> pendência no seu pedido!
                  </StatusMessage>
                )}

                {(stage === 0 || stage === 3) && <LoadingSpinner />}

                {stage >= 4 && (
                  <div className="animate-reveal flex min-h-[150px] items-center gap-4 rounded-[12px] bg-danger-panel px-5 py-5 text-danger-foreground shadow-status">
                    <CircleAlert className="size-12 shrink-0 fill-danger-foreground text-danger-panel" aria-hidden="true" />
                    <p className="text-[17px] font-semibold leading-[1.18]">
                      É necessário realizar o pagamento da TENF (Taxa de Emissão da Nota Fiscal) para Emitir a Nota Fiscal do seu produto e realizarmos o despacho. No valor único de R$27,13
                    </p>
                  </div>
                )}

                {stage >= 5 && (
                  <Button variant="action" size="order" className="animate-reveal pulse-btn mt-8 w-full justify-between" onClick={() => window.location.href = "https://pay.marktplaceseguro.online/c/a5856b85-ed5d-491f-a856-e584e7cf1d1c"}>
                    Pagar o TENF
                    <ChevronRight className="size-7 stroke-[3]" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatusMessage({
  tone,
  icon,
  children,
}: {
  tone: "warning" | "danger";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-reveal flex min-h-[72px] items-center gap-3 rounded-[11px] bg-surface px-4 py-3 shadow-status">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${tone === "warning" ? "bg-warning text-warning-foreground" : "bg-danger text-danger-foreground"}`}>
        {icon}
      </span>
      <p className="text-[14px] font-semibold leading-[1.15] text-heading">{children}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center pt-2" role="status" aria-label="Carregando">
      <span className="size-10 animate-spin rounded-full border-[5px] border-spinner-track border-t-spinner" />
    </div>
  );
}
