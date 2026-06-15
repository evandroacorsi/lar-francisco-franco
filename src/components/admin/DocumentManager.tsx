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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchJson } from "@/lib/api";
import type { TransparencyDocument, TransparencyDocumentSection } from "@/lib/transparencyDocuments";
import { Edit, FileText, Loader2, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type DocumentFormData = {
  id: string;
  title: string;
  section: TransparencyDocumentSection;
  year: string;
  dateLabel: string;
  order: string;
};

const emptyFormData: DocumentFormData = {
  id: "",
  title: "",
  section: "accountability",
  year: new Date().getFullYear().toString(),
  dateLabel: "",
  order: "1",
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Ocorreu um erro inesperado.";

const getSessionToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Sessão inválida");
  return session.access_token;
};

const sectionLabel = (section: TransparencyDocumentSection) =>
  section === "accountability" ? "Prestação de contas" : "Institucional";

export function DocumentManager() {
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TransparencyDocument | null>(null);
  const [formData, setFormData] = useState<DocumentFormData>(emptyFormData);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const isEditing = Boolean(formData.id);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchJson<{ documents: TransparencyDocument[] }>("/api/documents.php");
      setDocuments(Array.isArray(data.documents) ? data.documents : []);
    } catch (error: unknown) {
      toast({
        title: "Erro ao carregar documentos",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const resetForm = () => {
    setFormData(emptyFormData);
    setSelectedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (document: TransparencyDocument) => {
    setFormData({
      id: document.id,
      title: document.title,
      section: document.section,
      year: document.year || new Date().getFullYear().toString(),
      dateLabel: document.dateLabel,
      order: String(document.order || 0),
    });
    setSelectedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      const token = await getSessionToken();
      const body = new FormData();
      body.append("id", formData.id);
      body.append("title", formData.title);
      body.append("section", formData.section);
      body.append("year", formData.section === "accountability" ? formData.year : "");
      body.append("dateLabel", formData.dateLabel);
      body.append("order", formData.order);

      const file = fileInputRef.current?.files?.[0];
      if (file) body.append("file", file);

      await fetchJson<{ success: boolean; document: TransparencyDocument }>("/api/documents.php", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      toast({ title: isEditing ? "Documento atualizado" : "Documento criado" });
      resetForm();
      await fetchDocuments();
    } catch (error: unknown) {
      toast({
        title: "Erro ao salvar documento",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);
      const token = await getSessionToken();
      await fetchJson<{ success: boolean }>(`/api/documents.php?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({ title: "Documento excluído" });
      setDeleteTarget(null);
      await fetchDocuments();
    } catch (error: unknown) {
      toast({
        title: "Erro ao excluir documento",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const accountabilityDocuments = documents.filter((document) => document.section === "accountability");
  const institutionalDocuments = documents.filter((document) => document.section === "institutional");

  const renderDocument = (document: TransparencyDocument) => (
    <Card key={document.id} className="bg-white">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h4 className="truncate font-semibold">{document.title}</h4>
            <Badge variant="secondary">{sectionLabel(document.section)}</Badge>
            {document.year && <Badge variant="outline">{document.year}</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            {document.dateLabel || "Sem data"} · Ordem {document.order} · {document.fileName || "Sem arquivo"}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="button" variant="outline" asChild>
            <a href={document.url} target="_blank" rel="noopener noreferrer">
              Visualizar
            </a>
          </Button>
          <Button type="button" variant="secondary" className="gap-2" onClick={() => handleEdit(document)}>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button type="button" variant="destructive" className="gap-2" onClick={() => setDeleteTarget(document)}>
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="h-fit bg-white">
          <CardHeader>
            <h3 className="text-xl font-bold">{isEditing ? "Editar documento" : "Novo documento"}</h3>
            <p className="text-sm text-muted-foreground">
              Cadastre PDFs para prestação de contas ou documentos institucionais.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Seção</Label>
                <Select
                  value={formData.section}
                  onValueChange={(section: TransparencyDocumentSection) => {
                    setFormData((prev) => ({
                      ...prev,
                      section,
                      year: section === "accountability" ? prev.year || new Date().getFullYear().toString() : "",
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accountability">Prestação de contas</SelectItem>
                    <SelectItem value="institutional">Documentos institucionais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Ex: Balanço Anual 2026"
                  required
                  maxLength={160}
                />
              </div>

              {formData.section === "accountability" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Ano</Label>
                    <Input
                      value={formData.year}
                      onChange={(event) => setFormData((prev) => ({ ...prev, year: event.target.value }))}
                      placeholder="2026"
                      required
                      maxLength={20}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data exibida</Label>
                    <Input
                      value={formData.dateLabel}
                      onChange={(event) => setFormData((prev) => ({ ...prev, dateLabel: event.target.value }))}
                      placeholder="Dez/2026"
                      maxLength={80}
                    />
                  </div>
                </div>
              )}

              {formData.section === "institutional" && (
                <div className="space-y-2">
                  <Label>Descrição curta opcional</Label>
                  <Input
                    value={formData.dateLabel}
                    onChange={(event) => setFormData((prev) => ({ ...prev, dateLabel: event.target.value }))}
                    placeholder="Ex: Atualizado em 2026"
                    maxLength={80}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(event) => setFormData((prev) => ({ ...prev, order: event.target.value }))}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label>Arquivo PDF {isEditing ? "(opcional para substituir)" : ""}</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    {selectedFileName || "Selecionar PDF"}
                  </Button>
                  {selectedFileName && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedFileName("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 gap-2" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isEditing ? "Salvar alterações" : "Cadastrar"}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {loading ? "Carregando documentos..." : `${documents.length} documento(s) cadastrado(s)`}
            </p>
            <Button type="button" variant="outline" className="gap-2" disabled={loading} onClick={fetchDocuments}>
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>

          {loading ? (
            <div className="rounded-lg border bg-white p-10 text-center text-muted-foreground">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
              Carregando documentos...
            </div>
          ) : (
            <>
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">Prestação de contas</h3>
                {accountabilityDocuments.length === 0 ? (
                  <div className="rounded-lg border border-dashed bg-white p-8 text-center text-muted-foreground">
                    Nenhum documento cadastrado nesta seção.
                  </div>
                ) : (
                  accountabilityDocuments.map(renderDocument)
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">Documentos institucionais</h3>
                {institutionalDocuments.length === 0 ? (
                  <div className="rounded-lg border border-dashed bg-white p-8 text-center text-muted-foreground">
                    Nenhum documento cadastrado nesta seção.
                  </div>
                ) : (
                  institutionalDocuments.map(renderDocument)
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação remove o documento da listagem e apaga o PDF correspondente do servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            {deleteTarget?.title}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {saving ? "Excluindo..." : "Excluir documento"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
