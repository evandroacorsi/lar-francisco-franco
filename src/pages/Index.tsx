
import { Hero } from "@/components/Hero";
import { ProgramCard } from "@/components/ProgramCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Users,
  Target,
  Shield,
  BookOpen,
  Brain,
  Palette,
  Home,
  HandHeart,
  DollarSign,
  Gift,
  Briefcase,
  Calendar,
  ArrowRight,
  Eye,
  ImageOff
} from "lucide-react";

import Parceiros from "@/components/Parceiros";

import { Link } from "react-router-dom";
import i1 from "@/assets/1.png";
import i2 from "@/assets/2.png";
import i3 from "@/assets/3.png";
import i4 from "@/assets/4.png";
import i5 from "@/assets/5.png";
import i6 from "@/assets/6.png";
import { useEffect, useState } from 'react'

const Index = () => {

  const [recentNews, setRecentNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        // Chamamos a API pedindo apenas 3 notícias
        const response = await fetch("https://aprovacao.larfranciscofranco.com.br/noticias.php?limit=3");
        const data = await response.json();

        // Garante que é um array
        const noticiasArray = data.noticias || (Array.isArray(data) ? data : []);
        setRecentNews(noticiasArray);
      } catch (error) {
        console.error("Erro ao carregar notícias recentes:", error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchRecentNews();
  }, []);

  // Função auxiliar para formatar data (YYYY-MM-DD -> DD de Mes, YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };
  return (
    <div className="min-h-screen">

      {/* Hero Section (Manter igual) */}
      <Hero />

      {/* Sobre Section - CORRIGIDO (Idade e Texto) */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sobre o Lar Francisco Franco
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-white/95 leading-relaxed">
              Desde 1960, somos uma entidade social sem fins lucrativos que utiliza o Serviço de Convivência e Fortalecimento de Vínculos,
              atendendo crianças e adolescentes de <strong>6 a 15 anos</strong> em situação de vulnerabilidade social nas zonas rurais e urbanas
              do município de Rancharia no contraturno escolar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center shadow-card hover:shadow-hover transition-smooth bg-white">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">65+</div>
                <p className="text-muted-foreground">Anos de História</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card hover:shadow-hover transition-smooth bg-white">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">20000+</div>
                <p className="text-muted-foreground">Vidas Transformadas</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card hover:shadow-hover transition-smooth bg-white">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">6-15</div>
                <p className="text-muted-foreground">Anos (Faixa Etária)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Missão - CORRIGIDO (Idade) */}
      <section className="pb-12 pt-24 px-4">
        <div className="container-custom">
          {/* ... Cabeçalho Missão (manter igual) ... */}

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-hover transition-smooth bg-white">
              <CardContent className="p-8">
                <Target className="text-primary mb-4" size={48} />
                <h3 className="text-2xl font-bold text-primary mb-4">Missão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Proteger e orientar crianças e adolescentes de <strong>6 a 15 anos</strong> em situação de
                  vulnerabilidade, trabalhando em parceria com a Assistência Social para garantir
                  seus direitos e fortalecer os vínculos familiares e comunitários.
                </p>
              </CardContent>
            </Card>

            {/* Visão e Valores mantidos iguais ao seu código original */}
            <Card className="shadow-card hover:shadow-hover transition-smooth bg-white">
              <CardContent className="p-8">
                <Eye className="text-primary mb-4" size={48} />
                <h3 className="text-2xl font-bold text-primary mb-4">Visão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ser referência na oferta do Serviço de Convivência e Fortalecimento de Vínculos,
                  reconhecida pela qualidade do atendimento socioassistencial e pelo compromisso
                  com a proteção social de crianças e adolescentes em situação de vulnerabilidade social,
                  em articulação com a rede de Assistência Social.
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
                    <span>Compromisso com o desenvolvimento integral</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Solidariedade e responsabilidade social</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Transparência e ética</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Trabalho em equipe e profissionalismo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ... Divisória ... */}

      {/* Programas - CORRIGIDO (Removido Acolhimento/24h) */}
      <section className="pt-6 pb-12 bg-background px-4">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Nossos Programas
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos um conjunto completo de atividades socioeducativas para o desenvolvimento integral.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProgramCard
              icon={Users}
              title="Serviço de Convivência"
              description="Ambiente seguro e estimulante no contraturno escolar, focado na cidadania e prevenção de riscos."
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
              description="Atendimento técnico especializado para fortalecimento emocional e garantia de direitos."
              image={i3}
            />
            <ProgramCard
              icon={Palette}
              title="Cultura e Lazer"
              description="Oficinas de música, dança, capoeira e esportes que promovem a socialização."
              image={i4}
            />
            <ProgramCard
              icon={Heart}
              title="Fortalecimento de Vínculos"
              description="Trabalho social com as famílias para prevenir a ruptura de laços e promover a convivência."
              image={i5}
            />
            <ProgramCard
              icon={Shield}
              title="Rede de Proteção"
              description="Articulação com CRAS, CREAS, Saúde e Educação para o atendimento integral."
              image={i6}
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="cta" size="lg" asChild>
              <Link to="/sobre">
                Conheça mais sobre nós
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Como Ajudar - CORRIGIDO (Texto) */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Como Você Pode Ajudar
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Sua contribuição faz toda a diferença na vida das crianças e adolescentes atendidos. Conheça as formas de apoiar nosso trabalho.
            </p>
          </div>

          {/* ... Cards de doação (manter igual) ... */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center shadow-card hover:shadow-hover transition-smooth hover:scale-105 bg-white">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                  <DollarSign className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-primary">Doações Financeiras</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contribua mensalmente ou com valor único
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-hover transition-smooth hover:scale-105 bg-white">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Gift className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-primary">Doações de Materiais</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Roupas, alimentos, materiais
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-hover transition-smooth hover:scale-105 bg-white">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                  <HandHeart className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-primary">Voluntariado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Doe seu tempo e talento
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-hover transition-smooth hover:scale-105 bg-white">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Briefcase className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-primary">Parcerias</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Empresas e instituições parceiras
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="xl" asChild>
              <Link to="/como-ajudar">
                Saiba Como Contribuir
                <Heart className="fill-primary" size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ... Restante do código (Parceiros, Blog, CTA Final) ... */}

      <Parceiros />

      {/* Divisória Decorativa */}
      <div className="w-full py-12 flex justify-center items-center">
        <div className="relative w-full max-w-4xl">
          {/* Linha central com gradiente */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />

          {/* Elemento decorativo centrado */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 bg-background">
            <Heart
              className="text-primary drop-shadow-md animate-pulse"
              size={36}
            />
          </div>
        </div>
      </div>

      {/* Blog Preview - MODIFICADO PARA DADOS REAIS */}
      <section className="pt-6 pb-12 px-4">
        <div className="container-custom">
          <div className="flex justify-center items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
                Últimas Notícias
              </h2>
              <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
                Acompanhe de perto as atividades, conquistas e parcerias do Lar Francisco Franco.
              </p>
            </div>
          </div>

          {loadingNews ? (
            // Skeleton / Carregando
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-80 animate-pulse bg-gray-100 border-none">
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div className="h-40 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentNews.length > 0 ? (
            // Notícias Reais
            <div className="grid md:grid-cols-3 gap-8">
              {recentNews.map((item, index) => (
                <Link
                  to={`/noticia/${item.id}`}
                  key={item.id}
                  className="block group"
                  style={{
                    animation: `slideUp 0.5s ease-out forwards ${index * 0.2}s`,
                    opacity: 0
                  }}
                >
                  <Card className="relative overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-none group-hover:-translate-y-2 bg-white">
                    <div className="h-48 w-full overflow-hidden relative">
                      {/* Badge flutuante na imagem */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-primary/90 text-white text-[10px] px-2 py-1 rounded shadow-lg backdrop-blur-sm">
                          Novidade
                        </span>
                      </div>

                      {item.imagem ? (
                        <img
                          src={item.imagem}
                          alt={item.titulo}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <ImageOff size={48} className="text-muted-foreground/30" />
                        </div>
                      )}
                      {/* Overlay gradiente na imagem */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3">
                        <Calendar size={14} />
                        {formatDate(item.data)}
                      </div>
                      <h3 className="font-bold text-xl mb-3 group-hover:text-primary leading-tight transition-colors">
                        {item.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {item.descricao}
                      </p>
                      <div className="flex items-center text-primary font-bold text-sm">
                        Ver notícia completa
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            // Caso não tenha notícias (opcional)
            <div className="text-center text-muted-foreground">
              <p>Nenhuma notícia recente no momento.</p>
            </div>
          )}

          <div className="flex w-full justify-center align-center">
            <Button variant="outline" size="xl" className="mt-12" asChild>
              <Link to="/noticias">Ver Todas
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final - CORRIGIDO (Texto) */}
      <section className="section-padding bg-primary text-primary-foreground border-b-4">
        <div className="container-custom text-center">
          <Heart className="mx-auto mb-6 fill-secondary text-secondary" size={64} />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faça Parte Dessa Transformação
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Cada contribuição, por menor que seja, faz uma enorme diferença na vida das crianças e adolescentes atendidos.
            Juntos, podemos construir futuros melhores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/como-ajudar">Quero Ajudar Agora</Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/contato">Entre em Contato</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;