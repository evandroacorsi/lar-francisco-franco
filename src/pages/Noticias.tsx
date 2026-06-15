import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  Newspaper,
  Search,
} from "lucide-react";
import {
  fetchPublicNews,
  filterNews,
  findCategoryBySlug,
  getNewsCategories,
  slugifyCategory,
  type NewsSummary,
} from "@/lib/news";

const PAGE_SIZE = 6;

type ImageWithLoadingProps = {
  src: string;
  alt: string;
};

const ImageWithLoading = ({ src, alt }: ImageWithLoadingProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const secureSrc = src?.includes("https://") ? src : src?.replace("http://", "https://");

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoading(false);
    }
  }, []);

  return (
    <div className="relative mb-4 h-48 w-full overflow-hidden rounded bg-gray-200">
      {loading && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
          <div className="h-8 w-8 animate-spin rounded-full border-b-4 border-t-4 border-primary" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <ImageOff className="mb-2 h-8 w-8" />
          <span className="text-xs">Imagem indisponível</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={secureSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </div>
  );
};

const formatDate = (date: string) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("pt-BR");
};

const getPageWindow = (currentPage: number, totalPages: number) => {
  const windowSize = 5;
  const halfWindow = Math.floor(windowSize / 2);
  const start = Math.max(1, Math.min(currentPage - halfWindow, totalPages - windowSize + 1));
  const end = Math.min(totalPages, start + windowSize - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const getCategoriaColor = (categoria: string) => {
  switch (categoria) {
    case "Assistência Social": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Campanhas": return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Eventos": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "Prestação de Contas": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "Meio Ambiente": return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    case "Cuidados e Saúde": return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Lazer": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Atividades": return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const Noticias = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState<NewsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPublicNews()
      .then(setNoticias)
      .finally(() => setLoading(false));
  }, []);

  const categorias = useMemo(() => getNewsCategories(noticias), [noticias]);
  const routeCategory = useMemo(
    () => findCategoryBySlug(categorias, categorySlug),
    [categorias, categorySlug],
  );
  const activeCategory = routeCategory || categoriaFiltro;

  const noticiasFiltradas = useMemo(
    () => filterNews(noticias, searchTerm, activeCategory),
    [noticias, searchTerm, activeCategory],
  );

  const totalPages = Math.max(1, Math.ceil(noticiasFiltradas.length / PAGE_SIZE));
  const paginatedNews = noticiasFiltradas.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const pageWindow = getPageWindow(currentPage, totalPages);
  const hasFilters = Boolean(searchTerm || activeCategory);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoriaFiltro("");
    navigate("/noticias");
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setCategoriaFiltro("");
      navigate("/noticias");
      return;
    }

    setCategoriaFiltro(value);
    navigate(`/noticias/categoria/${slugifyCategory(value)}`);
  };

  const changePage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow pt-20">
        <section className="section-padding mb-12 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
          <div className="container-custom text-center">
            <Newspaper className="mx-auto mb-6 text-white" size={64} />
            <h1 className="mb-6 animate-fade-in text-4xl font-bold text-white md:text-5xl">
              Notícias
            </h1>
            <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-secondary" />
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/95 md:text-xl">
              Acompanhe as últimas novidades, eventos e conquistas do <br /> Lar Francisco Franco - "Casa das Meninas".
            </p>
          </div>
        </section>

        <div className="container-custom px-4 pb-16">
          <div className="mb-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por título, resumo ou categoria..."
                  className="h-[50px] w-full rounded-lg border px-4 py-3 pl-11 shadow-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <Select
                value={activeCategory || "all"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-[50px] w-full rounded-lg border bg-white px-4 shadow-sm focus:ring-2 focus:ring-primary md:w-1/4">
                  <SelectValue placeholder="Todas categorias" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={5}
                  className="max-h-[300px] w-[var(--radix-select-trigger-width)] overflow-y-auto bg-white shadow-md"
                >
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-primary" />
            </div>
          ) : noticiasFiltradas.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50 p-8 text-center text-muted-foreground">
              <p className="mb-4 text-lg font-medium">Nenhuma notícia encontrada.</p>
              {hasFilters ? (
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
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {paginatedNews.map((noticia) => (
                  <Card key={noticia.id} className="flex h-full flex-col overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {noticia.categoria.map((cat) => (
                            <Link key={cat} to={`/noticias/categoria/${slugifyCategory(cat)}`}>
                              <Badge className={getCategoriaColor(cat)} variant="secondary">{cat}</Badge>
                            </Link>
                          ))}
                        </div>
                        <div className="flex items-center text-xs font-medium text-muted-foreground">
                          <Eye className="mr-1 h-3 w-3 text-primary" />
                          {noticia.visualizacoes}
                        </div>
                      </div>
                      <CardTitle className="line-clamp-2 text-xl font-bold leading-tight text-foreground">
                        {noticia.titulo}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col pt-0">
                      {noticia.imagem[0] && <ImageWithLoading src={noticia.imagem[0]} alt={noticia.titulo} />}

                      <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {noticia.descricao}
                      </p>

                      <div className="mt-auto border-t pt-4">
                        <div className="mb-4 flex items-center text-xs font-medium text-muted-foreground">
                          <Calendar className="mr-2 h-3 w-3 text-primary" />
                          {formatDate(noticia.data)}
                        </div>

                        <Link to={`/noticias/${noticia.slug}`} className="block w-full">
                          <div className="group inline-flex h-10 w-full items-center justify-center rounded-md border border-primary bg-background px-4 py-2 text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            Ler notícia completa
                            <ArrowRight className="ml-2 h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        size="default"
                        onClick={(event) => {
                          event.preventDefault();
                          changePage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </PaginationLink>
                    </PaginationItem>

                    {pageWindow.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(event) => {
                            event.preventDefault();
                            changePage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        size="default"
                        onClick={(event) => {
                          event.preventDefault();
                          changePage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      >
                        Próxima
                        <ChevronRight className="h-4 w-4" />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Noticias;
