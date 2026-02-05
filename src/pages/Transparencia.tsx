import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Shield, Users, TrendingUp, Scale, BookOpen, Info, Calendar, Eye, Building2 } from "lucide-react";
const prestacaoContas = [
  {
    ano: "2025",
    items: [
      { nome: "Balanço Anual 2025", data: "Dez/2025", link: "/docs/Balanço 2025.pdf" },
      { nome: "Relatório de Atividades 2025", data: "Em breve", link: null },
    ],
  },
  {
    ano: "2024",
    items: [
      { nome: "Balanço Anual 2024", data: "Dez/2024", link: "/docs/Balanço 2024.pdf" },
      { nome: "Relatório de Atividades 2024", data: "Dez/2024", link: "/docs/Relatório de Atividades 2024.pdf" },
    ],
  }
];

const documentosInstitucionais = [
  { nome: "Estatuto Social", icon: FileText, link: "/docs/ESTATUTO ATUALIZADO 2022.pdf" },
  { nome: "Ata de Eleição da Diretoria", icon: FileText, link: "/docs/ATA DE ELEIÇÃO E POSSE 2024 REGISTRADA.pdf" },
  { nome: "Cartão CNPJ", icon: FileText, link: "/docs/Cartão CNPJ.pdf" },
];


const DocumentButton = ({ link }) => {
  if (link) {
    return (
      <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary/10" asChild>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Eye size={16} className="mr-2 text-primary" />
          <span className="text-primary font-medium">Visualizar</span>
        </a>
      </Button>
    );
  }

  return (
    <Button size="sm" variant="ghost" disabled className="opacity-50">
      <Eye size={16} className="mr-2" />
      Em breve
    </Button>
  );
};

/* =========================
   COMPONENTE PRINCIPAL
========================= */

const Transparencia = () => {
  return (
    <div className="min-h-screen">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary via-primary/95 to-primary/90">
          <div className="container-custom text-center">
            <Shield className="mx-auto mb-6 text-white" size={64} />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Transparência
            </h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
            <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              Prestamos contas de forma clara e transparente sobre todos os recursos recebidos e aplicados pela OSC.
            </p>
          </div>
        </section>

        {/* Compromisso */}
        <section className="section-padding bg-background pb-0">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-primary mb-6">Nosso Compromisso</h2>
              <p className="text-muted-foreground leading-relaxed">
                Acreditamos que a transparência é fundamental para construir e manter a confiança dos nossos
                parceiros, doadores e da comunidade.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {[
                { icon: Shield, title: "Certificações", desc: "Utilidade Pública Municipal, Estadual e Federal" },
                { icon: Users, title: "Gestão", desc: "Diretoria voluntária e profissionais qualificados" },
                { icon: TrendingUp, title: "Resultados", desc: "Relatórios anuais com indicadores e metas" },
              ].map((item, i) => (
                <Card key={i} className="text-center shadow-card hover:shadow-hover transition-smooth">
                  <CardContent className="p-8">
                    <item.icon className="mx-auto mb-4 text-secondary" size={48} />
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fundamentação Legal */}
        <section className="py-16 bg-primary/5 border-y border-primary/10">
          <div className="container-custom">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Scale className="text-primary" size={32} />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Fundamentação Legal</h2>
              </div>
              <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Lei de Acesso à Informação */}
              <a
                href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="bg-white border-l-4 border-l-secondary shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Info className="text-secondary" size={28} />
                        <h3 className="text-xl font-bold text-primary">Lei de Acesso à Informação</h3>
                      </div>
                      <Eye size={20} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 mb-2">Lei nº 12.527/2011</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Esta lei aplica-se às entidades privadas sem fins lucrativos que recebem recursos públicos para a realização de ações de interesse público.
                    </p>
                    <div className="mt-4 text-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      Ler lei completa <TrendingUp size={12} />
                    </div>
                  </CardContent>
                </Card>
              </a>

              {/* Marco Regulatório (MROSC) */}
              <a
                href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l13019.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="bg-white border-l-4 border-l-primary shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-primary" size={28} />
                        <h3 className="text-xl font-bold text-primary">Marco Regulatório (MROSC)</h3>
                      </div>
                      <Eye size={20} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 mb-2">Lei nº 13.019/2014</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Estabelece o regime jurídico das parcerias entre a administração pública e as organizações da sociedade civil (OSC).
                    </p>
                    <div className="mt-4 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      Ler lei completa <TrendingUp size={12} />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>
        </section>

        {/* Seção Dinâmica de Prestação de Contas */}
        <section className="section-padding bg-muted">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Prestações de Contas
              </h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {prestacaoContas.map((ano) => (
                <Card key={ano.ano} className="shadow-card overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
                    <h3 className="text-2xl font-bold text-primary">{ano.ano}</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {ano.items.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                              <Calendar className="text-secondary" size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{doc.nome}</p>
                              <p className="text-xs text-muted-foreground">{doc.data}</p>
                            </div>
                          </div>
                          <DocumentButton link={doc.link} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documentos Institucionais Dinâmicos */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Documentos Institucionais
              </h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 ">
              {documentosInstitucionais.map((doc, idx) => (
                <Card key={idx} className="shadow-card hover:shadow-hover transition-smooth bg-muted/50 border-none">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4 bg-white rounded-sm border-radius">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-sm">
                      <doc.icon className="text-primary-foreground" size={32} />
                    </div>
                    <span className="font-bold text-primary min-h-[40px] flex items-center">
                      {doc.nome}
                    </span>
                    <DocumentButton link={doc.link} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Diretoria (Mantido igual) */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/10">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Diretoria Atual
              </h2>
              <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Gestão 2023-2025
              </p>
            </div>

            {/* Presidente em Destaque */}
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="shadow-hover bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Presidente</h3>
                  <p className="text-lg text-muted-foreground">Viviane Rebello Schwartz Reginato</p>
                </CardContent>
              </Card>
            </div>

            {/* Outros Membros */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              {[
                { cargo: "Vice-Presidente", nome: "João Gonçalo Da Silva" },
                { cargo: "Tesoureira", nome: " Ana Lúcia De Souza Rebelo" },
                { cargo: "Secretária", nome: "Edi Maria Bossoni" },
                { cargo: "Conselho Fiscal", nome: "Jussara Carmela Martins Rodrigues" },
                { cargo: "Conselho Fiscal", nome: "Maria Aparecida Pereira Dias" },
                { cargo: "Conselho Fiscal", nome: "Griselda Aparecida Borges" },

              ].map((membro, index) => (
                <Card key={index} className="shadow-card hover:shadow-hover transition-smooth bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-primary">{membro.cargo}</h3>
                        <p className="text-muted-foreground">{membro.nome}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Transparencia;