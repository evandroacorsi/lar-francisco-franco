import { Card, CardContent } from "@/components/ui/card"; // Ajuste os imports conforme seu projeto
import ProjetoGuri from "@/assets/logo-guri.jpg";
import AABB from "@/assets/logo-aabb.webp";
import Prefeitura from "@/assets/logo-prefeitura.webp";
import Governo from "@/assets/logo-governo-estadual-federal.webp";

const Parceiros = () => {
    return (
        <section className="px-4 pt-24 pb-12">
            <div className="container-custom">
                {/* Cabeçalho da Seção */}
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        Nossas Parcerias
                    </h2>
                    <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Trabalhamos em conjunto com diversas instituições para oferecer o <br />melhor atendimento
                    </p>
                </div>

                {/* Grid de Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Card 1: Projeto Guri */}
                    <Card className="text-center shadow-card hover:shadow-hover transition-smooth bg-white">
                        <CardContent className="p-6">
                            {/* Área da Logo substituindo o ícone anterior */}
                            <div className="h-24 flex items-center justify-center mb-4">
                                <img
                                    src={ProjetoGuri} // Certifique-se que o caminho está correto
                                    alt="Logo Guri"
                                    className="h-full w-auto object-contain mx-auto"
                                />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Guri</h3>
                            <p className="text-sm text-muted-foreground">
                                Parceria para desenvolvimento artístico e cultural através de aulas de <br />canto e instrumentos.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 2: AABB Comunidade */}
                    <Card className="text-center shadow-card hover:shadow-hover transition-smooth bg-white">
                        <CardContent className="p-6">
                            {/* Área da Logo substituindo o ícone anterior */}
                            <div className="h-24 flex items-center justify-center mb-4">
                                <img
                                    src={AABB} // Certifique-se que o caminho está correto
                                    alt="Logo AABB Comunidade"
                                    className="h-full w-auto object-contain mx-auto"
                                />
                            </div>
                            <h3 className="font-bold text-lg mb-2">AABB Comunidade</h3>
                            <p className="text-sm text-muted-foreground">
                                Atividades esportivas e recreativas, sessão de espaço e recursos para compra de uniformes e materiais.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 3: Governo Municipal (Prefeitura) */}
                    <Card className="text-center shadow-card hover:shadow-hover transition-smooth bg-white">
                        <CardContent className="p-6">
                            {/* Área da Logo substituindo o ícone anterior */}
                            <div className="h-24 flex items-center justify-center mb-4">
                                <img
                                    src={Prefeitura} // Certifique-se que o caminho está correto
                                    alt="Logo Governo Municipal"
                                    className="h-full w-auto object-contain mx-auto"
                                />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Prefeitura de Rancharia/SP</h3>
                            <p className="text-sm text-muted-foreground">
                                Apoio e convênios locais para transporte, holerites e <br />mantimento da entidade.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 4: Governos Estadual e Federal */}
                    <Card className="text-center shadow-card hover:shadow-hover transition-smooth bg-white">
                        <CardContent className="p-6">
                            {/* Área da Logo substituindo o ícone anterior */}
                            <div className="h-24 flex items-center justify-center mb-4">
                                <img
                                    src={Governo} // Certifique-se que o caminho está correto
                                    alt="Logo Governos Estadual e Federal"
                                    className="h-full w-auto object-contain mx-auto"
                                />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Governos Estadual e Federal</h3>
                            <p className="text-sm text-muted-foreground">
                                Políticas públicas e recursos através de parcerias com deputados <br />estaduais e federais.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Parceiros;