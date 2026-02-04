import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, ArrowRight, ImageOff, Newspaper } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Componente de Imagem Melhorado e Robusto
const ImageWithLoading = ({ src, alt }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const imgRef = useRef(null);

    // Se já é HTTPS, mantemos. Se for HTTP, trocamos.
    const secureSrc = src?.includes("https://") ? src : src?.replace("http://", "https://");

    useEffect(() => {
        // Correção para Cache: Se a imagem já estiver no cache do navegador,
        // o evento onLoad pode não disparar. Verificamos manualmente aqui.
        if (imgRef.current && imgRef.current.complete) {
            setLoading(false);
        }
    }, []);

    return (
        <div className="relative w-full h-48 mb-4 rounded overflow-hidden bg-gray-200">
            {/* Spinner só aparece se estiver carregando E não deu erro */}
            {loading && !error && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-100 z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-primary"></div>
                </div>
            )}

            {error ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-100 text-gray-400 z-20">
                    <ImageOff className="h-8 w-8 mb-2" />
                    <span className="text-xs">Imagem indisponível</span>
                </div>
            ) : (
                <img
                    ref={imgRef}
                    src={secureSrc}
                    alt={alt}
                    className={`object-cover w-full h-full transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        console.error("Erro ao carregar imagem:", secureSrc);
                        setLoading(false);
                        setError(true);
                    }}
                />
            )}
        </div>
    );
};

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");

    const CACHE_KEY = "noticiasCache";
    const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

    const fetchNoticias = async (cursor = null, reset = false) => {
        try {
            if (cursor) setLoadingMore(true);
            else setLoading(true);

            // Ajuste a URL base conforme necessário (ex: /api/noticias.php se estiver usando proxy no vite ou URL completa)
            const url = new URL("https://aprovacao.larfranciscofranco.com.br/noticias.php");
            url.searchParams.append("limit", "6");
            if (cursor) url.searchParams.append("cursor", cursor);
            if (searchTerm) url.searchParams.append("search", searchTerm);
            if (categoriaFiltro) url.searchParams.append("categoria", categoriaFiltro);

            const res = await fetch(url.toString());
            const data = await res.json();

            const noticiasRecebidas = Array.isArray(data) ? data : data.noticias;

            if (reset) {
                setNoticias(noticiasRecebidas);
            } else if (cursor) {
                setNoticias(prev => [...prev, ...noticiasRecebidas]);
            } else {
                setNoticias(noticiasRecebidas);
            }

            setNextCursor(data.next_cursor || null);

            if (!searchTerm && !categoriaFiltro && !cursor) {
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({
                        noticias: noticiasRecebidas,
                        nextCursor: data.next_cursor || null,
                        timestamp: Date.now(),
                    })
                );
            }
        } catch (err) {
            console.error("Erro ao buscar notícias:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!searchTerm && !categoriaFiltro) {
            const cache = localStorage.getItem(CACHE_KEY);
            if (cache) {
                const parsed = JSON.parse(cache);
                const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

                if (!isExpired) {
                    setNoticias(parsed.noticias);
                    setNextCursor(parsed.nextCursor);
                    setLoading(false);
                    return;
                } else {
                    localStorage.removeItem(CACHE_KEY);
                }
            }
        }
        fetchNoticias(null, true);
    }, [searchTerm, categoriaFiltro]);

    const getCategoriaColor = (categoria) => {
        switch (categoria) {
            case "Assistência Social": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case "Campanhas": return "bg-green-100 text-green-800 hover:bg-green-200";
            case "Eventos": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            case "Prestação de Contas": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
            case "Meio Ambiente": return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
            case "Saúde": return "bg-red-100 text-red-800 hover:bg-red-200";
            case "Lazer": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            case "Atividades": return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
            default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setCategoriaFiltro("");
    };

    return (
        <div className="min-h-screen flex flex-col"> {/* Adicionado flex-col para footer ficar embaixo se necessário */}

            <main className="pt-20 flex-grow">
                {/* Cabeçalho */}
                <section className="section-padding bg-gradient-to-br from-primary via-primary/95 to-primary/90 mb-12">
                    <div className="container-custom text-center">
                        <Newspaper className="mx-auto mb-6 text-white" size={64} />
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
                            Notícias
                        </h1>
                        <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full" />
                        <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
                            Acompanhe as últimas novidades, eventos e conquistas do <br /> Lar Francisco Franco - "Casa das Meninas".
                        </p>
                    </div>
                </section>

                {/* Container Principal do Conteúdo - CORREÇÃO DE LAYOUT E SINTAXE */}
                <div className="container-custom px-4 pb-16">

                    {/* Filtros */}
                    <div className="text-center mb-12">
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            {/* Input de Busca */}
                            <input
                                type="text"
                                placeholder="Buscar por título..."
                                className="border rounded-lg px-4 py-3 w-full md:w-1/3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm h-[50px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* Novo Select com Scroll */}
                            <Select
                                value={categoriaFiltro}
                                onValueChange={(value) => setCategoriaFiltro(value === "all" ? "" : value)}
                            >
                                <SelectTrigger className="w-full md:w-1/4 h-[50px] bg-white border rounded-lg px-4 shadow-sm focus:ring-2 focus:ring-primary">
                                    <SelectValue placeholder="Todas categorias" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    sideOffset={5}
                                    className="max-h-[300px] w-[var(--radix-select-trigger-width)] bg-white shadow-md overflow-y-auto"
                                >                                    <SelectItem value="all">Todas categorias</SelectItem>
                                    {[
                                        "Assistência Social", "Atividades", "Avisos", "Campanhas",
                                        "Cultura", "Cuidados e Saúde", "Depoimentos", "Doações",
                                        "Esportes", "Eventos", "Informativo", "Lazer",
                                        "Meio Ambiente", "Oficinas", "Parcerias",
                                        "Prestação de Contas", "Projetos", "Transparência"
                                    ].sort().map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Lógica de Exibição */}
                    {loading && noticias.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
                        </div>
                    ) : noticias.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground bg-gray-50 rounded-xl p-8 border border-dashed">
                            <p className="text-lg mb-4 font-medium">Nenhuma notícia encontrada 😔</p>
                            {searchTerm || categoriaFiltro ? (
                                <>
                                    <p>Tente limpar os filtros ou buscar por outro termo.</p>
                                    <Button onClick={resetFilters} variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                                        Limpar Filtros
                                    </Button>
                                </>
                            ) : (
                                <p>Volte mais tarde para conferir novas notícias.</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {noticias.map((noticia) => (
                                    <Card key={noticia.id} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border-border/50 overflow-hidden">
                                        <CardHeader>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {(Array.isArray(noticia.categoria) ? noticia.categoria : noticia.categoria.split(",").map(c => c.trim())).map((cat) => (
                                                        <Badge key={cat} className={getCategoriaColor(cat)} variant="secondary">{cat}</Badge>
                                                    ))}
                                                </div>
                                                <div className="flex items-center text-muted-foreground text-xs font-medium">
                                                    <Eye className="h-3 w-3 mr-1 text-primary" />
                                                    {noticia.visualizacoes}
                                                </div>
                                            </div>
                                            <CardTitle className="text-xl font-bold leading-tight text-foreground line-clamp-2 min-h-[3.5rem]">
                                                {noticia.titulo}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex-1 flex flex-col pt-0">
                                            {noticia.imagem && <ImageWithLoading src={noticia.imagem} alt={noticia.titulo} />}

                                            <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                                                {noticia.descricao}
                                            </p>

                                            <div className="mt-auto border-t pt-4">
                                                <div className="flex items-center text-muted-foreground text-xs mb-4">
                                                    <Calendar className="h-3 w-3 mr-2 text-primary" />
                                                    {(() => {
                                                        const [ano, mes, dia] = noticia.data.split("-");
                                                        return `${dia}/${mes}/${ano}`;
                                                    })()}
                                                </div>

                                                {/* CORREÇÃO: Botão dentro de Link causava erro. 
                                                    Usamos um div estilizado como botão ou passamos as classes direto pro Link */}
                                                <NavLink to={`/noticia/${noticia.id}`} className="block w-full">
                                                    <div className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 group border-primary text-primary hover:bg-primary/10">
                                                        Ler notícia completa
                                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform text-primary" />
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {nextCursor && (
                                <div className="text-center mt-12">
                                    <Button
                                        onClick={() => fetchNoticias(nextCursor)}
                                        variant="outline"
                                        size="lg"
                                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-w-[200px]"
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? (
                                            <>
                                                <span className="animate-spin mr-2">⏳</span> Carregando...
                                            </>
                                        ) : (
                                            "Carregar Mais Notícias"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div> {/* Fechamento do container-custom (Isso faltava ou estava solto antes) */}
            </main>
        </div>
    );
};

export default Noticias;