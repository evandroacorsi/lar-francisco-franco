import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, FileText, Users } from "lucide-react"; // Adicionei ícones novos
import logo from "@/assets/logo.webp";
import { NewsList } from "@/components/admin/NewsList";
import { NewsDialog } from "@/components/admin/NewsDialog";
// Importar componentes das Abas
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para Notícias
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logout realizado", description: "Você saiu com sucesso." });
    navigate("/auth");
  };

  // Funções de Notícias
  const handleEditNews = (news: any) => {
    setEditingNews(news);
    setIsNewsDialogOpen(true);
  };
  const handleCloseNewsDialog = () => {
    setIsNewsDialogOpen(false);
    setEditingNews(null);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Lar Francisco Franco" className="h-16" />
            <div>
              <h1 className="text-xl font-bold text-muted">Painel Administrativo</h1>
              <p className="text-sm text-muted">Lar Francisco Franco - Casa das Meninas</p>
            </div>
          </div>

          <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">

        {/* Componente de Abas para separar os conteúdos */}
        <Tabs defaultValue="news" className="w-full">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <TabsList className="bg-white">
              <TabsTrigger value="news" className="gap-2">
                <FileText className="h-4 w-4" /> Notícias
              </TabsTrigger>
            </TabsList>
          </div>

          {/* CONTEÚDO DA ABA DE NOTÍCIAS */}
          <TabsContent value="news">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Gerenciar Notícias</h2>
                <p className="text-muted-foreground mt-1">Crie, edite e gerencie as notícias do site</p>
              </div>
              <Button onClick={() => setIsNewsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Nova Notícia
              </Button>
            </div>

            <NewsList onEdit={handleEditNews} key={`news-${refreshKey}`} />
          </TabsContent>


        </Tabs>
      </main>

      {/* Dialogs */}
      <NewsDialog
        open={isNewsDialogOpen}
        onOpenChange={handleCloseNewsDialog}
        editingNews={editingNews}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />

    </div>
  );
}