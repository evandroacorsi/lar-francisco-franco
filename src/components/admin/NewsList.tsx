import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Importe o Input
import { Edit, Trash2, Eye, Search, X } from "lucide-react"; // Ícones novos
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewsListProps {
  onEdit: (news: any) => void;
}

export function NewsList({ onEdit }: NewsListProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Estados para Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/noticias.php", window.location.origin);
      url.searchParams.append("limit", "12");

      if (searchTerm) url.searchParams.append("search", searchTerm);

      if (categoriaFiltro && categoriaFiltro !== "all") {
        url.searchParams.append("categoria", categoriaFiltro);
      }

      const response = await fetch(url.toString());

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      setNews(data.noticias || []);
    } catch (error: any) {
      console.error("Erro no fetch:", error);
      toast({
        title: "Erro ao carregar notícias",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Dispara a busca sempre que os filtros mudarem
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNews();
    }, 500); // 500ms de debounce para não sobrecarregar o PHP enquanto digita

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, categoriaFiltro]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/noticias.php?id=${deleteId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || "Erro ao deletar");

      toast({ title: "Notícia deletada" });
      setNews((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (error: any) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* Barra de Filtros no Admin */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-muted/30 p-4 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pelo título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
          {searchTerm && (
            <X
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>

        {/* Select Aprimorado com Scroll */}
        <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
          <SelectTrigger className="w-full md:w-[220px] bg-white">
            <SelectValue placeholder="Todas categorias" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]"> {/* Aqui definimos a altura máxima do scroll */}
            <SelectItem value="all">Todas categorias</SelectItem>
            {[
              "Atividades", "Avisos", "Campanhas", "Cultura", "Cuidados e Saúde",
              "Depoimentos", "Doações", "Esportes", "Eventos", "Informativo",
              "Lazer", "Meio Ambiente", "Oficinas", "Parcerias", "Prestação de Contas",
              "Projetos", "Transparência"
            ].sort().map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="p-8 text-center animate-pulse">Carregando notícias...</div>
      ) : news.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-muted-foreground">Nenhuma notícia encontrada para estes filtros.</p>
          {(searchTerm || categoriaFiltro) && (
            <Button variant="link" onClick={() => { setSearchTerm(""); setCategoriaFiltro(""); }}>
              Limpar filtros
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col group">
              <div className="h-40 overflow-hidden bg-muted relative">
                {item.imagem ? (
                  <img src={item.imagem} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Sem imagem</div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8 shadow-md" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardHeader className="p-4 flex-1">
                <h3 className="font-bold text-md line-clamp-2 leading-tight">{item.titulo}</h3>
              </CardHeader>

              <CardContent className="p-4 pt-0 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">{item.descricao}</p>
                <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground border-t pt-3">
                  <span>{item.data ? new Date(item.data).toLocaleDateString("pt-BR") : "-"}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {item.visualizacoes}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de confirmação restaurado */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta notícia? Ela será movida para a lixeira do Notion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}