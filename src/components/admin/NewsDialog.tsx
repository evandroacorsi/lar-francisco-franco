import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchJson } from "@/lib/api";
import { getNewsCategories, type NewsPost, type NewsSummary } from "@/lib/news";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  Bold,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Code,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Loader2,
  Minus,
  Plus,
  Type,
  Underline,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface NewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNews?: NewsPost | null;
  onSuccess?: () => void;
}

type MediaItem = {
  name: string;
  url: string;
  size: number;
  modifiedAt: string;
};

type MediaTarget = "cover" | "content";

type MediaPagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

const MEDIA_PAGE_SIZE = 12;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_CONTEUDO_LENGTH = 100000;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Ocorreu um erro inesperado.";

const getPageWindow = (currentPage: number, totalPages: number) => {
  const windowSize = 5;
  const halfWindow = Math.floor(windowSize / 2);
  const start = Math.max(1, Math.min(currentPage - halfWindow, totalPages - windowSize + 1));
  const end = Math.min(totalPages, start + windowSize - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeHtml = (value: string) =>
  escapeAttribute(value).replace(/'/g, "&#039;");

export function NewsDialog({ open, onOpenChange, editingNews, onSuccess }: NewsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    data: new Date().toISOString().split("T")[0],
    titulo: "",
    descricao: "",
    conteudo: "",
    categoria: [] as string[],
    imagem: [] as string[],
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>(getNewsCategories([]));
  const [imageInput, setImageInput] = useState("");
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [mediaPagination, setMediaPagination] = useState<MediaPagination>({
    page: 1,
    perPage: MEDIA_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<MediaTarget>("cover");
  const [mediaLoading, setMediaLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  function juntarConteudos(news: NewsPost & { conteudo2?: string; conteudo3?: string }) {
    return [
      news?.conteudo,
      news?.conteudo2,
      news?.conteudo3,
    ]
      .filter(Boolean)
      .join("");
  }

  useEffect(() => {
    if (!open) return;

    fetchJson<{ noticias: NewsSummary[] }>("/api/news.php")
      .then((data) => setCategoryOptions(getNewsCategories(Array.isArray(data.noticias) ? data.noticias : [])))
      .catch(() => setCategoryOptions(getNewsCategories([])));

    setEditorMode("visual");
    setCategoryInput("");
    setImageInput("");

    if (editingNews) {
      let imagensTratadas: string[] = [];
      const rawImagem = editingNews.imagem as unknown;

      if (editingNews.imagens && Array.isArray(editingNews.imagens)) {
        imagensTratadas = editingNews.imagens;
      } else if (Array.isArray(rawImagem)) {
        imagensTratadas = editingNews.imagem;
      } else if (typeof rawImagem === "string" && rawImagem.length > 0) {
        imagensTratadas = [rawImagem];
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
  }, [editingNews, open]);

  const categoriasDisponiveis = useMemo(
    () => Array.from(new Set([...categoryOptions, ...formData.categoria].map((item) => item.trim()).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b)),
    [categoryOptions, formData.categoria],
  );

  useEffect(() => {
    if (open && editorMode === "visual" && editorRef.current) {
      if (document.activeElement === editorRef.current) return;
      editorRef.current.innerHTML = formData.conteudo || "<p><br></p>";
    }
  }, [open, editorMode, editingNews, formData.conteudo]);

  const updateConteudo = (value: string) => {
    if (value.length <= MAX_CONTEUDO_LENGTH) {
      setFormData(prev => ({ ...prev, conteudo: value }));
    }
  };

  const syncEditorContent = () => {
    if (editorRef.current) updateConteudo(editorRef.current.innerHTML);
  };

  const runEditorCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditorContent();
  };

  const getSelectedText = () => window.getSelection()?.toString() || "";

  const insertHtml = (html: string) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    syncEditorContent();
  };

  const closestEditorElement = (node: Node | null, selector: string) => {
    let element = node instanceof Element ? node : node?.parentElement;

    while (element && element !== editorRef.current) {
      if (element.matches(selector)) return element;
      element = element.parentElement;
    }

    return null;
  };

  const insertBlockHtml = (html: string) => {
    editorRef.current?.focus();

    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const heading = closestEditorElement(range?.commonAncestorContainer ?? null, "h1,h2,h3,h4,h5,h6");

    if (!range || !heading || !editorRef.current?.contains(heading)) {
      insertHtml(html);
      return;
    }

    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const nodes = Array.from(template.content.childNodes);
    heading.after(...nodes);

    const lastNode = nodes[nodes.length - 1];
    if (lastNode) {
      const nextRange = document.createRange();
      nextRange.setStartAfter(lastNode);
      nextRange.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(nextRange);
    }

    syncEditorContent();
  };

  const insertLink = () => {
    const text = window.prompt("Texto exibido no link:", getSelectedText() || "Clique aqui");
    if (!text) return;

    const url = window.prompt("URL do link:");
    if (!url) return;

    const safeUrl = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") ? url : `https://${url}`;
    insertHtml(`<a href="${escapeAttribute(safeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`);
  };

  const insertHighlightBlock = () => {
    const text = getSelectedText() || "Texto em destaque";
    insertHtml(`<blockquote style="border-left: 4px solid #0099fa; background: #eef7ff; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; font-style: italic;">${escapeHtml(text)}</blockquote><p><br></p>`);
  };

  const insertContentImage = (url: string, alt = "") => {
    const safeUrl = escapeAttribute(url);
    const safeAlt = escapeAttribute(alt);
    const html = `<figure style="margin: 24px 0; text-align: center;"><img src="${safeUrl}" alt="${safeAlt}" style="max-width: 100%; height: auto; border-radius: 8px;" /></figure><p><br></p>`;

    if (editorMode === "code") {
      updateConteudo(`${formData.conteudo}\n${html}`);
      return;
    }

    insertBlockHtml(html);
  };

  const getSessionToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("Sessão inválida");
    return session.access_token;
  };

  const fetchMediaLibrary = async (page = 1) => {
    try {
      setMediaLoading(true);
      const token = await getSessionToken();
      const data = await fetchJson<{ media: MediaItem[]; pagination?: MediaPagination }>(`/api/media.php?page=${page}&perPage=${MEDIA_PAGE_SIZE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMediaLibrary(Array.isArray(data.media) ? data.media : []);
      setMediaPagination(data.pagination ?? {
        page,
        perPage: MEDIA_PAGE_SIZE,
        total: Array.isArray(data.media) ? data.media.length : 0,
        totalPages: 1,
      });
    } catch (error: unknown) {
      toast({
        title: "Erro ao carregar biblioteca",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setMediaLoading(false);
    }
  };

  const openMediaLibrary = async (target: MediaTarget) => {
    setMediaTarget(target);
    setMediaOpen(true);
    await fetchMediaLibrary(1);
  };

  const selectMedia = (media: MediaItem) => {
    if (mediaTarget === "cover") {
      setFormData(prev => ({ ...prev, imagem: [...prev.imagem, media.url] }));
    } else {
      insertContentImage(media.url, media.name);
    }

    setMediaOpen(false);
  };

  const toggleCategoria = (categoria: string) => {
    setFormData(prev => ({
      ...prev,
      categoria: prev.categoria.includes(categoria)
        ? prev.categoria.filter(c => c !== categoria)
        : [...prev.categoria, categoria],
    }));
  };

  const addCategory = () => {
    const categoria = categoryInput.trim();
    if (!categoria) return;

    setFormData(prev => ({
      ...prev,
      categoria: prev.categoria.includes(categoria) ? prev.categoria : [...prev.categoria, categoria],
    }));
    setCategoryOptions(prev => Array.from(new Set([...prev, categoria])).sort((a, b) => a.localeCompare(b)));
    setCategoryInput("");
  };

  const handleAddImageURL = () => {
    if (imageInput.trim()) {
      let url = imageInput.trim();
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem anexada deve ter no máximo 5 MB.",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        toast({
          title: "Formato inválido",
          description: "Use JPG, PNG, WebP ou GIF.",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }

      await uploadFile(file, mediaTarget);
    }
  };

  const uploadFile = async (file: File, target: MediaTarget) => {
    setUploading(true);

    try {
      const token = await getSessionToken();
      const data = new FormData();
      data.append("image", file);

      const result = await fetchJson<{ success?: boolean; media: MediaItem }>("/api/media.php", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      setMediaLibrary(prev => [result.media, ...prev]);

      if (target === "cover") {
        setFormData(prev => ({ ...prev, imagem: [...prev.imagem, result.media.url] }));
      } else {
        insertContentImage(result.media.url, result.media.name);
      }

      toast({ title: "Imagem enviada com sucesso" });
    } catch (error: unknown) {
      toast({
        title: "Erro no upload",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (img: string) => {
    setFormData(prev => ({
      ...prev,
      imagem: prev.imagem.filter((i) => i !== img),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const conteudoAtual = editorMode === "visual" && editorRef.current
      ? editorRef.current.innerHTML
      : formData.conteudo;

    if (conteudoAtual.length > MAX_CONTEUDO_LENGTH) {
      toast({
        title: "Conteúdo muito grande",
        description: `O texto ultrapassa o limite de ${MAX_CONTEUDO_LENGTH} caracteres.`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Sessão inválida");

      const json = await fetchJson<{ success?: boolean; message?: string; error?: string; details?: { message?: string } }>("/api/news.php", {
        method: editingNews ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          conteudo: conteudoAtual,
          id: editingNews?.id,
          slug: editingNews?.slug,
          visualizacoes: editingNews?.visualizacoes ?? 0,
        }),
      });

      if (json.error && !json.success && !json.message) {
        throw new Error(json.error || json.details?.message || "Erro ao processar requisição");
      }

      toast({
        title: editingNews ? "Notícia atualizada" : "Notícia criada",
        description: "As alterações foram salvas com sucesso.",
      });

      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      toast({
        title: "Erro ao salvar",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? "Editar Notícia" : "Nova Notícia"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-7">
              <div className="space-y-2 md:col-span-2">
                <Label>Data</Label>
                <Input
                  className="bg-white appearance-none"
                  type="date"
                  value={formData.data}
                  onChange={(event) => setFormData({ ...formData, data: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-5">
                <Label>Título</Label>
                <Input
                  className="bg-white"
                  placeholder="Título da manchete"
                  value={formData.titulo}
                  onChange={(event) => setFormData({ ...formData, titulo: event.target.value })}
                  required
                  maxLength={160}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label>Descrição Curta (Resumo)</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.descricao.length}/600
                </span>
              </div>
              <Textarea
                className="min-h-[120px] resize-y bg-white"
                placeholder="Aparece no card da listagem..."
                value={formData.descricao}
                onChange={(event) => setFormData({ ...formData, descricao: event.target.value })}
                required
                rows={5}
                maxLength={600}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Conteúdo Completo
                <span className="ml-2 text-xs text-muted-foreground">
                  ({formData.conteudo.length}/{MAX_CONTEUDO_LENGTH})
                </span>
              </Label>

              <div className="overflow-hidden rounded-lg border bg-white">
                <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2">
                  <Button type="button" size="icon" variant="ghost" title="Negrito" onClick={() => runEditorCommand("bold")}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" title="Itálico" onClick={() => runEditorCommand("italic")}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" title="Sublinhado" onClick={() => runEditorCommand("underline")}>
                    <Underline className="h-4 w-4" />
                  </Button>

                  <span className="mx-1 h-6 w-px bg-border" />

                  <Button type="button" size="icon" variant="ghost" title="Alinhar à esquerda" onClick={() => runEditorCommand("justifyLeft")}>
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" title="Centralizar" onClick={() => runEditorCommand("justifyCenter")}>
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" title="Justificar" onClick={() => runEditorCommand("justifyFull")}>
                    <AlignJustify className="h-4 w-4" />
                  </Button>

                  <span className="mx-1 h-6 w-px bg-border" />

                  <Button type="button" size="icon" variant="ghost" title="Diminuir fonte" onClick={() => runEditorCommand("fontSize", "2")}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" title="Fonte normal" onClick={() => runEditorCommand("fontSize", "3")}>
                    <Type className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" title="Aumentar fonte" onClick={() => runEditorCommand("fontSize", "5")}>
                    <Plus className="h-4 w-4" />
                  </Button>

                  <span className="mx-1 h-6 w-px bg-border" />

                  <Button type="button" size="icon" variant="ghost" title="Inserir link" onClick={insertLink}>
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" title="Bloco de destaque" onClick={insertHighlightBlock}>
                    <Highlighter className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" title="Inserir imagem" onClick={() => openMediaLibrary("content")}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={editorMode === "code" ? "default" : "ghost"}
                    className="ml-auto gap-2"
                    onClick={() => {
                      if (editorMode === "visual") syncEditorContent();
                      setEditorMode(editorMode === "visual" ? "code" : "visual");
                    }}
                  >
                    <Code className="h-4 w-4" />
                    {editorMode === "visual" ? "Código" : "Editor"}
                  </Button>
                </div>

                {editorMode === "visual" ? (
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="prose prose-sm min-h-[260px] max-w-none p-4 outline-none focus:ring-2 focus:ring-primary/20"
                    onInput={syncEditorContent}
                    onBlur={syncEditorContent}
                  />
                ) : (
                  <Textarea
                    className="min-h-[260px] rounded-none border-0 bg-white font-mono text-sm focus-visible:ring-0"
                    placeholder="<p>Escreva HTML aqui...</p>"
                    value={formData.conteudo}
                    onChange={(event) => updateConteudo(event.target.value)}
                  />
                )}
              </div>

              {formData.conteudo.length >= MAX_CONTEUDO_LENGTH && (
                <p className="text-xs text-destructive">
                  Limite máximo de {MAX_CONTEUDO_LENGTH} caracteres atingido.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Categorias</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="h-auto min-h-[40px] w-full justify-between"
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
                        {categoriasDisponiveis.map((cat) => (
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
                                  : "opacity-0",
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

              <div className="flex gap-2">
                <Input
                  value={categoryInput}
                  onChange={(event) => setCategoryInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCategory();
                    }
                  }}
                  placeholder="Digite uma nova categoria"
                  className="bg-white"
                  maxLength={60}
                />
                <Button type="button" variant="secondary" className="gap-2" onClick={addCategory}>
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>

              {formData.categoria.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 rounded-md border bg-muted/20 p-2">
                  {formData.categoria.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="cursor-pointer transition-colors hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => toggleCategoria(cat)}
                    >
                      {cat} x
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Label>Imagens da Notícia</Label>
                <div className="flex w-full gap-2 sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 flex-1 gap-2 sm:w-32 sm:flex-none"
                    onClick={() => openMediaLibrary("cover")}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Biblioteca
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setMediaTarget("cover");
                      fileInputRef.current?.click();
                    }}
                    variant="default"
                    disabled={uploading}
                    className="h-10 flex-1 gap-2 sm:w-32 sm:flex-none"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Enviando..." : "Upload"}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  value={imageInput}
                  onChange={(event) => setImageInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), handleAddImageURL())}
                  placeholder="Cole um link ou use o botão de upload"
                  className="flex-1 bg-white"
                />

                <Button type="button" onClick={handleAddImageURL} size="icon" variant="secondary" title="Adicionar Link">
                  <Plus className="h-4 w-4" />
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                />
              </div>

              {formData.imagem.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {formData.imagem.map((img, index) => (
                    <div key={`${img}-${index}`} className="group relative aspect-video overflow-hidden rounded-md border bg-muted">
                      <img
                        src={img}
                        alt="Preview"
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        onError={(event) => (event.currentTarget.src = "https://placehold.co/400x300?text=Erro+Imagem")}
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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

                      <div className="absolute bottom-1 right-1">
                        {img.includes("drive.google") ? (
                          <Badge variant="outline" className="h-5 bg-white/80 px-1 text-[10px]">Drive</Badge>
                        ) : (
                          <Badge variant="secondary" className="h-5 px-1 text-[10px]">Local</Badge>
                        )}
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

      <Dialog open={mediaOpen} onOpenChange={setMediaOpen}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mediaTarget === "cover" ? "Escolher imagem da notícia" : "Inserir imagem no conteúdo"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Selecione uma imagem enviada anteriormente ou faça upload de uma nova.
            </p>
            <Button
              type="button"
              className="gap-2"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Nova imagem
            </Button>
          </div>

          {mediaLoading ? (
            <div className="p-10 text-center text-muted-foreground">Carregando biblioteca...</div>
          ) : mediaLibrary.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
              Nenhuma imagem enviada ainda.
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Exibindo {mediaLibrary.length} de {mediaPagination.total} imagem(ns)
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {mediaLibrary.map((media) => (
                  <button
                    type="button"
                    key={media.url}
                    className="group overflow-hidden rounded-lg border bg-white text-left transition-all hover:border-primary hover:shadow-md"
                    onClick={() => selectMedia(media)}
                  >
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={media.url}
                        alt={media.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-medium">{media.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {Math.ceil(media.size / 1024)} KB
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {mediaPagination.totalPages > 1 && (
                <Pagination className="pt-2">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        size="default"
                        onClick={(event) => {
                          event.preventDefault();
                          fetchMediaLibrary(mediaPagination.page - 1);
                        }}
                        className={mediaPagination.page === 1 ? "pointer-events-none opacity-50" : ""}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </PaginationLink>
                    </PaginationItem>

                    {getPageWindow(mediaPagination.page, mediaPagination.totalPages).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === mediaPagination.page}
                          onClick={(event) => {
                            event.preventDefault();
                            fetchMediaLibrary(page);
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
                          fetchMediaLibrary(mediaPagination.page + 1);
                        }}
                        className={mediaPagination.page === mediaPagination.totalPages ? "pointer-events-none opacity-50" : ""}
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
        </DialogContent>
      </Dialog>
    </>
  );
}
