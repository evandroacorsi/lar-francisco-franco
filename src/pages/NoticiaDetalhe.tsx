import { useParams, Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react"; // Adicionado Fragment
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// --- INÍCIO DO INTERPRETADOR ---
const renderRichText = (text: string) => {
    if (!text) return null;

    // Função auxiliar para processar negrito (**), sublinhado (__) e destaque (==)
    // Isso permite que essas formatações funcionem dentro e fora do blockquote
    const processInlineStyles = (content: string) => {
        const regex = /(\*\*.*?\*\*|__.*?__|==.*?==)/g;
        const parts = content.split(regex);

        return parts.map((part, i) => {
            // Negrito: **texto**
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            // Sublinhado: __texto__
            if (part.startsWith('__') && part.endsWith('__')) {
                return <u key={i} className="decoration-primary decoration-2 underline-offset-2">{part.slice(2, -2)}</u>;
            }
            // Destaque: ==texto==
            if (part.startsWith('==') && part.endsWith('==')) {
                return <span key={i} className="bg-yellow-200 text-yellow-900 px-1 rounded">{part.slice(2, -2)}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    // Quebra o texto em linhas
    const lines = text.split('\n');

    return lines.map((line, index) => {
        if (!line.trim()) return <br key={index} className="" />;

        // --- NOVO: Verifica se a linha começa com ">" ---
        if (line.trim().startsWith('>')) {
            // Remove o ">" do início para mostrar só o texto
            const cleanText = line.trim().substring(1).trim();

            return (
                <blockquote key={index} className="border-l-4 border-primary pl-4 py-2 text-lg italic text-gray-700 bg-gray-50 rounded-r-lg shadow-sm">
                    {processInlineStyles(cleanText)}
                </blockquote>
            );
        }

        // Parágrafo normal
        return (
            <p key={index} className="min-h-[1.5em]">
                {processInlineStyles(line)}
            </p>
        );
    });
};
// --- FIM DO INTERPRETADOR ---

const NoticiaDetalhes = () => {
    const { id } = useParams();
    const [noticia, setNoticia] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    const conteudoCompleto = [
        noticia?.conteudo,
        noticia?.conteudo2,
        noticia?.conteudo3,
    ]
        .filter(Boolean)          // remove null, undefined e ""
        .join("");            // separa por parágrafo

    const [imagemAberta, setImagemAberta] = useState<string | null>(null);

    // Lógica do carrossel automático
    useEffect(() => {
        if (!noticia || !noticia.imagens || noticia.imagens.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % noticia.imagens.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [noticia]);

    // Busca da notícia
    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const jaVisualizada = sessionStorage.getItem(`noticia_${id}`);
                const res = await fetch(
                    `https://larfranciscofranco.com.br/noticia.php?id=${id}${!jaVisualizada ? "&increment=true" : ""}`
                );
                const data = await res.json();
                setNoticia(data);
                if (!jaVisualizada) sessionStorage.setItem(`noticia_${id}`, "true");
            } catch (error) {
                console.error("Erro ao buscar notícia:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNoticia();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    if (!noticia)
        return (
            <div className="text-center p-12">
                <h1 className="text-2xl font-bold">Notícia não encontrada</h1>
                <Link to="/noticias">
                    <Button variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                </Link>
            </div>
        );

    return (
        <div className="container mx-auto px-4 pt-8 pb-12 max-w-4xl">
            <Link to="/noticias">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Notícias
                </Button>
            </Link>

            {/* Carrossel (Mantido igual) */}
            {noticia.imagens?.length > 0 && (
                <section className="relative mb-8 w-full h-64 sm:h-80 md:h-96 lg:h-[450px] rounded-xl overflow-hidden shadow-md group">
                    {noticia.imagens.map((img: string, idx: number) => (
                        <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                            <img
                                src={img}
                                alt={`${noticia.titulo} - imagem ${idx + 1}`}
                                className="w-full h-full object-cover cursor-zoom-in"
                                onClick={() => setImagemAberta(img)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </div>
                    ))}
                    {/* Controles do Carrossel (Simplificados para leitura, mas mantenha o seu código original se preferir) */}
                    {noticia.imagens.length > 1 && (
                        <>
                            <button onClick={() => setCurrentSlide(currentSlide === 0 ? noticia.imagens.length - 1 : currentSlide - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full z-20">
                                <ChevronLeft />
                            </button>
                            <button onClick={() => setCurrentSlide((currentSlide + 1) % noticia.imagens.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full z-20">
                                <ChevronRight />
                            </button>
                        </>
                    )}
                </section>
            )}

            <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                    {noticia.titulo}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        {(() => {
                            if (!noticia.data) return "";
                            const [ano, mes, dia] = noticia.data.split("-");
                            return new Date(Number(ano), Number(mes) - 1, Number(dia)).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
                        })()}
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-none sm:shadow-sm sm:border">
                <CardContent className="px-2 py-4 sm:p-8">
                    {noticia.descricao && (
                        <div className="relative mb-10 p-6 bg-primary/20 rounded-2xl border border-slate-100 italic">
                            {/* Um detalhe visual discreto no topo para dar "personalidade" */}
                            <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                                Resumo
                            </div>
                            <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                                {noticia.descricao}
                            </p>
                        </div>
                    )}

                    {/* --- AQUI APLICAMOS O INTERPRETADOR --- */}
                    <div className="prose prose-lg prose-gray max-w-none text-justify leading-relaxed text-gray-800 break-words">
                        {renderRichText(conteudoCompleto)}
                    </div>
                </CardContent>
            </Card>

            {/* Rodapé */}
            <div className="text-center mt-16 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Gostou desta notícia?
                </h3>
                <p className="text-muted-foreground mb-8">
                    Acompanhe todas as novidades e atividades do Lar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                    <Link to="/noticias" className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                            Ver Mais Notícias
                        </Button>
                    </Link>
                    <Link to="/contato" className="w-full sm:w-auto">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            Entre em Contato
                        </Button>
                    </Link>
                </div>
            </div>
            {imagemAberta && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setImagemAberta(null)}
                >
                    {/* Botão fechar */}
                    <button
                        onClick={() => setImagemAberta(null)}
                        className="absolute top-4 right-4 text-white text-3xl font-bold hover:opacity-80"
                    >
                        ✕
                    </button>

                    {/* Imagem */}
                    <img
                        src={imagemAberta}
                        alt="Imagem ampliada"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // evita fechar ao clicar na imagem
                    />
                </div>
            )}
        </div>
    );
};

export default NoticiaDetalhes;