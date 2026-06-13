import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // ou onde estiver sua função cn
import { supabase } from "@/integrations/supabase/client";

interface NewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNews?: any;
  onSuccess?: () => void;
}

export function NewsDialog({ open, onOpenChange, editingNews, onSuccess }: NewsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Novo estado para loading do upload

  const [formData, setFormData] = useState({
    data: new Date().toISOString().split("T")[0],
    titulo: "",
    descricao: "",
    conteudo: "",
    categoria: [] as string[],
    imagem: [] as string[],
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null); // Referência para o input file oculto
  const { toast } = useToast();

  const MAX_CONTEUDO_LENGTH = 6000;
  const CONTEUDO_BLOCO = 2000;

  const CATEGORIAS_PREDEFINIDAS = [
    "Assistência Social",
    "Eventos",
    "Campanhas",
    "Atividades",
    "Prestação de Contas",
    "Esportes",
    "Meio Ambiente",
    "Informativo",
    "Doações",
    "Transparência",
    "Depoimentos",
    "Parcerias",
    "Cuidados e Saúde",
    "Oficinas",
    "Projetos",
    "Cultura",
    "Lazer",
    "Avisos",
  ].sort((a, b) =>
    a.localeCompare(b)
  );


  function dividirConteudo(texto: string) {
    return {
      conteudo: texto.slice(0, CONTEUDO_BLOCO),
      conteudo2: texto.slice(CONTEUDO_BLOCO, CONTEUDO_BLOCO * 2) || "",
      conteudo3: texto.slice(CONTEUDO_BLOCO * 2) || "",
    };
  }

  function juntarConteudos(news: any) {
    return [
      news?.conteudo,
      news?.conteudo2,
      news?.conteudo3,
    ]
      .filter(Boolean)
      .join("");
  }


  useEffect(() => {
    if (open) {
      if (editingNews) {
        let imagensTratadas: string[] = [];

        // LÓGICA ATUALIZADA:
        // 1. Tenta pegar "imagens" (plural, array vindo do novo PHP)
        if (editingNews.imagens && Array.isArray(editingNews.imagens)) {
          imagensTratadas = editingNews.imagens;
        }
        // 2. Fallback: Tenta pegar "imagem" se vier como array (alguns endpoints antigos)
        else if (Array.isArray(editingNews.imagem)) {
          imagensTratadas = editingNews.imagem;
        }
        // 3. Fallback: Pega "imagem" se for string única
        else if (typeof editingNews.imagem === 'string' && editingNews.imagem.length > 0) {
          imagensTratadas = [editingNews.imagem];
        }

        setFormData({
          data: editingNews.data ? editingNews.data.split("T")[0] : new Date().toISOString().split("T")[0],
          titulo: editingNews.titulo || "",
          descricao: editingNews.descricao || "",
          conteudo: juntarConteudos(editingNews),
          categoria: Array.isArray(editingNews.categoria) ? editingNews.categoria : [],
          imagem: imagensTratadas,
        });
      } else {
        setFormData({
          data: new Date().toISOString().split("T")[0],
          titulo: "",
          descricao: "",
          conteudo: "",
          categoria: [],
          imagem: [],
        });
      }
    }
  }, [editingNews, open]);

  const toggleCategoria = (categoria: string) => {
    setFormData(prev => ({
      ...prev,
      categoria: prev.categoria.includes(categoria)
        ? prev.categoria.filter(c => c !== categoria)
        : [...prev.categoria, categoria],
    }));
  };


  // --- Lógica Antiga de URL (Drive/Link direto) ---
  const handleAddImageURL = () => {
    if (imageInput.trim()) {
      let url = imageInput.trim();
      // Converte link do Drive se necessário
      if (url.includes("drive.google.com") && url.includes("/file/d/")) {
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
          url = `https://drive.google.com/uc?export=view&id=${idMatch[1]}&.png`;
        }
      }

      setFormData(prev => ({ ...prev, imagem: [...prev.imagem, url] }));
      setImageInput("");
    }
  };

  // --- NOVA LÓGICA DE UPLOAD ---
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const data = new FormData();
    data.append("imagem", file); // "imagem" deve bater com $_FILES['imagem'] no PHP

    let {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("Sessão inválida");

    try {
      const res = await fetch("/api/upload.php", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "X-Admin-Secret": import.meta.env.VITE_ADMIN_API_SECRET,
        },
        body: data, // Não usa headers JSON aqui, o navegador define multipart/form-data automático
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Falha no upload");
      }

      // Sucesso: Adiciona a URL devolvida pelo PHP na lista
      setFormData(prev => ({ ...prev, imagem: [...prev.imagem, json.url] }));
      toast({ title: "Imagem enviada com sucesso!" });

    } catch (error: any) {
      console.error("Erro upload:", error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Limpa o input para permitir selecionar o mesmo arquivo novamente se quiser
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (img: string) => {
    // 1. Remove visualmente da lista
    setFormData(prev => ({
      ...prev,
      imagem: prev.imagem.filter((i) => i !== img),
    }));

    let {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("Sessão inválida");

    // 2. Se for uma imagem local (nossa API), deleta do servidor imediatamente
    if (img.includes("/api/uploads/")) {
      try {
        await fetch("/api/delete-file.php", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "X-Admin-Secret": import.meta.env.VITE_ADMIN_API_SECRET,
          },
          body: JSON.stringify({ url: img })
        });
        toast({ title: "Arquivo removido do servidor" });
      } catch (e) {
        console.error("Erro ao deletar arquivo físico", e);
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validação de tamanho
    if (formData.conteudo.length > MAX_CONTEUDO_LENGTH) {
      toast({
        title: "Conteúdo muito grande",
        description: `O texto ultrapassa o limite de ${MAX_CONTEUDO_LENGTH} caracteres.`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // 🔹 Divide o conteúdo em 3 partes
    const { conteudo, conteudo2, conteudo3 } = dividirConteudo(formData.conteudo);

    try {
      const endpoint = editingNews
        ? "/api/news-update.php"
        : "/api/news-create.php";

      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Sessão inválida");


      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          "X-Admin-Secret": import.meta.env.VITE_ADMIN_API_SECRET,
        },

        body: JSON.stringify({
          ...formData,
          conteudo,
          conteudo2,
          conteudo3,
          id: editingNews?.id,
        }),
      });

      const json = await res.json();

      if (!res.ok || (json.error && !json.success && !json.message)) {
        throw new Error(json.error || json.details?.message || "Erro ao processar requisição");
      }

      toast({
        title: editingNews ? "Notícia Atualizada" : "Notícia Criada",
        description: "As alterações foram salvas com sucesso.",
      });

      if (onSuccess) onSuccess();
      onOpenChange(false);

    } catch (error: any) {
      console.error("Erro submit:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingNews ? "Editar Notícia" : "Nova Notícia"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">

          <div className="grid gap-4 md:grid-cols-7">
            <div className="md:col-span-2 space-y-2"> {/* Aumentado de 1 para 2 */}
              <Label>Data</Label>
              <Input
                className="bg-white appearance-none" // appearance-none ajuda em alguns browsers
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-5 space-y-2">
              <Label>Título</Label>
              <Input className="bg-white"
                placeholder="Título da manchete"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Descrição Curta */}
          <div className="space-y-2">
            <Label>Descrição Curta (Resumo)</Label>
            <Textarea className="bg-white"
              placeholder="Aparece no card da listagem..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Conteúdo Completo
              <span className="ml-2 text-xs text-muted-foreground">
                ({formData.conteudo.length}/{MAX_CONTEUDO_LENGTH})
              </span>
            </Label>

            <Textarea
              className="bg-white"
              placeholder="Texto completo da notícia..."
              value={formData.conteudo}
              onChange={(e) => {
                const value = e.target.value;

                if (value.length <= MAX_CONTEUDO_LENGTH) {
                  setFormData({ ...formData, conteudo: value });
                }
              }}
              rows={8}
            />

            {formData.conteudo.length >= MAX_CONTEUDO_LENGTH && (
              <p className="text-xs text-destructive">
                Limite máximo de {MAX_CONTEUDO_LENGTH} caracteres atingido.
              </p>
            )}
          </div>


          {/* Componente de Multi-Select para Categorias */}
          <div className="space-y-2">
            <Label>Categorias</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-auto min-h-[40px]"
                >
                  {formData.categoria.length > 0
                    ? `${formData.categoria.length} selecionada(s)`
                    : "Selecione as categorias..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar categoria..." />
                  <CommandList>
                    <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                    <CommandGroup>
                      {[...CATEGORIAS_PREDEFINIDAS]
                        .sort((a, b) => a.localeCompare(b))
                        .map((cat) => (
                          <CommandItem
                            key={cat}
                            value={cat}
                            onSelect={() => toggleCategoria(cat)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categoria.includes(cat)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {cat}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Exibição das Tags Selecionadas (fora do dropdown para fácil visualização/remoção) */}
            {formData.categoria.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 border rounded-md p-2 bg-muted/20">
                {formData.categoria.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => toggleCategoria(cat)} // Clique no badge para remover
                  >
                    {cat} ✕
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Imagens (Upload + URL) */}
          <div className="space-y-2">
            <Label>Imagens da Notícia</Label>

            <div className="flex gap-2 items-center">
              {/* Input de URL (Mantido como opção) */}
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImageURL())}
                placeholder="Cole um link ou use o botão de upload ->"
                className="flex-1 bg-white"
              />

              {/* Botão Adicionar URL */}
              <Button type="button" onClick={handleAddImageURL} size="icon" variant="secondary" title="Adicionar Link">
                <Plus className="h-4 w-4" />
              </Button>

              {/* Botão UPLOAD (Novo) */}
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden" // Esconde o input feio nativo
                  accept="image/*"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="default"
                  disabled={uploading}
                  className="gap-2"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Enviando..." : "Upload"}
                </Button>
              </div>
            </div>

            {/* Preview das Imagens */}
            {formData.imagem.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {formData.imagem.map((img, idx) => (
                  <div key={idx} className="relative group rounded-md overflow-hidden border bg-muted aspect-video">
                    <img
                      src={img}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/400x300?text=Erro+Imagem")}
                    />

                    {/* Botão para remover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => handleRemoveImage(img)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Badge indicando onde está hospedada */}
                    <div className="absolute bottom-1 right-1">
                      {img.includes('drive.google') ?
                        <Badge variant="outline" className="bg-white/80 text-[10px] h-5 px-1">Drive</Badge> :
                        <Badge variant="secondary" className="text-[10px] h-5 px-1">Local</Badge>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingNews ? "Salvar Alterações" : "Criar Notícia"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}