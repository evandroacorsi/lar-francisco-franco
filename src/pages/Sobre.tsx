import { Card, CardContent } from "@/components/ui/card";
import { ProgramCard } from "@/components/ProgramCard";
import {
  Users, Heart, Target, Award, Calendar,
  Home, BookOpen, Brain, Palette, Shield, Sparkles, Music
} from "lucide-react";

// Importe suas imagens aqui conforme seu projeto
import i1 from "@/assets/1.png";
import i2 from "@/assets/2.png";
import i3 from "@/assets/3.png";
import i4 from "@/assets/4.png";
import i5 from "@/assets/5.png";
import i6 from "@/assets/6.png";

import amanda from "@/assets/time/amanda.jpeg";
import bruna from "@/assets/time/bruna.jpg";
import carol from "@/assets/time/carol.jpeg";
import gilberto from "@/assets/time/gilberto.jpeg";
import joao from "@/assets/time/joao.jpeg";
import luiz from "@/assets/time/luiz.jpeg";
import michele from "@/assets/time/michele.jpeg";
import soraya from "@/assets/time/soraya.jpeg";
import sandra from "@/assets/time/sandra.jpg";
import tamara from "@/assets/time/tamara.jpeg";
import taina from "@/assets/time/taina.jpeg";
import vanderleia from "@/assets/time/vanderleia.jpeg";
import user from "@/assets/time/user.jpg";

const Sobre = () => {
  // Dados da Equipe (Mantidos conforme original, atualize se necessário)
  // Dados da Equipe Atualizados
  const teamMembers = [
    // Coordenação e Administração
    { name: "Sandra Barreto da Mota Gomes", role: "Coordenadora Geral", image: sandra },
    { name: "Soraya El Gharib Jorge Estevam", role: "Coordenadora Pedagógica", image: soraya },
    { name: "Michele Cristina Lima", role: "Secretária", image: michele },
    { name: "Maicon Sardinha", role: "Contador - Prisma Contabilidade", image: user },

    // Equipe Técnica
    { name: "Bruna de Lira Silva", role: "Assistente Social", image: bruna },

    // Educadores
    { name: "Carolina da Silva Souza", role: "Educadora Social", image: carol },
    { name: "Tainá Cristina da Silva Grilo de Moura", role: "Educadora Social", image: user },
    { name: "Luiz Felipe Santos Silva", role: "Educador Social", image: luiz },
    { name: "João Pedro de Oliveira Zafalon", role: "Educador Social", image: joao },
    { name: "Tamara Pascoal Barreto", role: "Educadora Social", image: tamara },
    { name: "Amanda Carolina Cavalcante Leite", role: "Educadora Social", image: amanda },
    { name: "Alexandre Félix", role: "Professor de Capoeira", image: user },

    // Apoio
    { name: "Vanderleia Roza da Silva de Abreu", role: "Serviços Gerais", image: vanderleia },
    { name: "Cristina Santos Soares Padilha", role: "Serviços Gerais", image: user },
    { name: "Gilberto Milani", role: "Zelador", image: gilberto },
  ];

  // Dados da Rotina
  const routineItems = [
    { time: "07h", activity: "Início da busca de crianças nos pontos de ônibus estratégicos e café da manhã" },
    { time: "08h", activity: "Início das atividades" },
    { time: "10h", activity: "Pausa para lanche da manhã (frutas)" },
    { time: "11h", activity: "Almoço para a turma da manhã" },
    { time: "12h", activity: "Troca de turno e almoço da turma da tarde" },
    { time: "13h", activity: "Início das atividades do período da tarde" },
    { time: "15h30", activity: "Pausa para o lanche da tarde" },
    { time: "16h30", activity: "Início da despedida e transporte para casa" },
  ];

  return (
    <div className="min-h-screen">
      <main className="pt-20">

        {/* 1. HERO SECTION */}
        <section className="section-padding bg-gradient-to-br from-primary via-primary/95 to-primary/90">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Sobre o Lar Francisco Franco
            </h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
            <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              Uma organização que desde 1960 dedica-se ao <strong>Serviço de Convivência e Fortalecimento de Vínculos</strong> para crianças e adolescentes de 6 a 15 anos, em parceria com a Assistência Social de Rancharia/SP.
            </p>
          </div>
        </section>

        {/* Nossa História */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in-left">
                <h2 className="text-3xl font-bold text-primary mb-6">Nossa História</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-justify">
                    O sonho começou na década de 50 com <strong>Dona Josefina Molina Alves</strong>, que idealizava um local para cuidar de meninas desamparadas. Compartilhando desse ideal, o então <strong>Deputado Francisco Franco</strong> doou o terreno para a concretização deste nobre sonho.
                  </p>
                  <p className="text-justify">
                    Fundado oficialmente em <strong>03 de outubro de 1960</strong>, a instituição funcionou inicialmente em regime de internato. Porém, acompanhando as mudanças sociais e legais, em 1993 readequou seu estatuto para atender a realidade local.
                  </p>
                  <p className="text-justify">
                    Hoje, atuamos como <strong>Serviço de Convivência e Fortalecimento de Vínculos</strong>. Através de parcerias com a Prefeitura, FENABB (AABB Comunidade) e Guri, atendemos cerca de 300 crianças e adolescentes, oferecendo oficinas, esporte, cultura e cidadania no contraturno escolar.
                  </p>
                </div>
              </div>

              <div className="animate-slide-in-right">
                <Card className="shadow-card">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-primary mb-6">Linha do Tempo</h3>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                            <Calendar className="text-primary" size={20} />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">1960</h4>
                          <p className="text-muted-foreground text-sm">Fundação por Dona Josefina e Dep. Francisco Franco.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                            <Users className="text-primary" size={20} />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">1994</h4>
                          <p className="text-muted-foreground text-sm">Início do Projeto "Um Novo Mundo" (Regime de semi-abrigo).</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                            <Award className="text-primary" size={20} />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">Hoje</h4>
                          <p className="text-muted-foreground text-sm">Serviço de Convivência para 300 crianças (6 a 15 anos).</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="section-padding bg-primary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Missão, Visão e Valores
              </h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-card hover:shadow-hover transition-smooth bg-white">
                <CardContent className="p-8">
                  <Target className="text-primary mb-4" size={48} />
                  <h3 className="text-2xl font-bold text-primary mb-4">Missão</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Atender crianças e adolescentes de 6 a 15 anos em situação de vulnerabilidade, através do Serviço de Convivência, assegurando seus direitos e fortalecendo os vínculos familiares e comunitários.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-hover transition-smooth bg-white">
                <CardContent className="p-8">
                  <Target className="text-primary mb-4" size={48} />
                  <h3 className="text-2xl font-bold text-primary mb-4">Visão</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser referência em atendimento socioeducativo, reconhecida pela excelência e pelo compromisso com o desenvolvimento social, inclusão e resgate da autoestima dos atendidos.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-hover transition-smooth bg-white">
                <CardContent className="p-8">
                  <Heart className="text-primary mb-4" size={48} />
                  <h3 className="text-2xl font-bold text-primary mb-4">Valores</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Amor e respeito à dignidade humana</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Fortalecimento de vínculos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Solidariedade e responsabilidade social</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Ética e Transparência</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. O QUE FAZEMOS (PROGRAMAS) */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                O Que Fazemos
              </h2>
              <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Ações socioeducativas no contraturno escolar para o desenvolvimento integral.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card Atualizado: Serviço de Convivência */}
              <ProgramCard
                icon={Users}
                title="Serviço de Convivência"
                description="Fortalecimento de vínculos familiares e sociais, prevenindo situações de risco através de um ambiente seguro e estimulante."
                image={i1}
              />
              <ProgramCard
                icon={Users}
                title="Participação Social"
                description="Ações que incentivam a participação, o protagonismo e a interação social das crianças e adolescentes no convívio coletivo."
                image={i2}
              />

              <ProgramCard
                icon={Brain}
                title="Apoio Psicossocial"
                description="Atendimento com psicóloga e assistente social para suporte emocional e garantia de direitos."
                image={i3}
              />
              <ProgramCard
                icon={Music}
                title="Cultura e Arte"
                description="Parceria com o Guri e oficinas de música, dança e capoeira para estimular a criatividade."
                image={i4}
              />
              <ProgramCard
                icon={Heart}
                title="Fortalecimento Familiar"
                description="Trabalho focado na inclusão social e no fortalecimento da função protetiva da família."
                image={i5}
              />
              <ProgramCard
                icon={Shield}
                title="Rede de Proteção"
                description="Articulação constante com o CRAS, CREAS, Saúde e Educação para assegurar os direitos do ECA."
                image={i6}
              />
            </div>
          </div>
        </section>

        {/* 5. DIFERENCIAIS E ROTINA */}
        <section className="section-padding bg-primary">
          <div className="container-custom">

            {/* Atividades Complementares */}
            <div className="mb-20">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Diferenciais do Atendimento</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all text-center">
                  <Heart className="text-secondary mb-4 mx-auto" size={40} />
                  <h3 className="text-xl font-bold mb-2 text-primary">Alimentação</h3>
                  <p className="text-sm text-muted-foreground">Cardápio nutritivo elaborado por nutricionista e fornecido pela Cozinha Piloto municipal.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all text-center">
                  <Sparkles className="text-secondary mb-4 mx-auto" size={40} />
                  <h3 className="text-xl font-bold mb-2 text-primary">Parcerias Fortes</h3>
                  <p className="text-sm text-muted-foreground">Programa AABB Integração Comunidade (FENABB) e Guri.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all text-center">
                  <Users className="text-secondary mb-4 mx-auto" size={40} />
                  <h3 className="text-xl font-bold mb-2 text-primary">Espaço e Lazer</h3>
                  <p className="text-sm text-muted-foreground">Atividades ao ar livre, esportes e recreação no amplo espaço da AABB de Rancharia.</p>
                </div>
              </div>
            </div>

            {/* Rotina */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-4">Nossa Rotina Diária</h2>
                <p className="text-muted">Estrutura organizada para atender os dois turnos escolares.</p>
              </div>
              <div className="space-y-4">
                {routineItems.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 p-4 bg-gray-50 rounded-lg border-l-4 border-secondary hover:bg-gray-100 transition-colors">
                    <div className="text-xl font-bold text-primary md:w-24 shrink-0">{item.time}</div>
                    <div className="text-gray-600">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. EQUIPE */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/10">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Nossa Equipe</h2>
              <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Profissionais dedicados ao bem-estar e desenvolvimento das crianças.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden group">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-secondary/20 p-1 mb-4 group-hover:border-secondary transition-colors">
                      <img
                        src={member.image}
                        alt={`Foto de ${member.name}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">{member.role}</p>
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

export default Sobre;