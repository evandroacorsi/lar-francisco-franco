import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Verifique se está usando sonner ou o hook use-toast
import { FaWhatsapp } from "react-icons/fa";

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    if (name === "telefone") {
      value = maskPhone(value);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Controle de Spam (1 minuto entre envios)
    const lastExecution = localStorage.getItem("lastFormSubmitLar");
    const now = Date.now();
    if (lastExecution && now - parseInt(lastExecution) < 60 * 1000) {
      toast.error("Aguarde um momento. Você pode enviar novamente em breve.");
      return;
    }

    // 2. Validações básicas
    if (formData.nome.length < 3) {
      toast.error("Por favor, informe seu nome completo.");
      return;
    }
    if (formData.telefone.length < 14) {
      toast.error("Por favor, preencha um telefone válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 3. Chamada para o send-mail.php
      const response = await fetch("https://larfranciscofranco.com.br/send-mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any),
      });

      const result = await response.json();

      if (result.status === "success") {
        localStorage.setItem("lastFormSubmitLar", now.toString());
        toast.success("Mensagem enviada com sucesso!");
        setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
      } else {
        toast.error(result.message || "Erro ao enviar. Tente novamente.");
      }
    } catch (error) {
      toast.error("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const maskPhone = (value: string) => {
    let r = value.replace(/\D/g, "");
    r = r.substring(0, 11);
    if (r.length > 10) r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    else if (r.length > 6) r = r.replace(/^(\d\d)(\d{4})(\d+).*/, "($1) $2-$3");
    else if (r.length > 2) r = r.replace(/^(\d\d)(\d+).*/, "($1) $2");
    else r = r.length === 0 ? "" : r.replace(/^(\d*)/, "($1");
    return r;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="pt-24 flex-grow bg-slate-50">
        <section className="bg-primary py-16 md:py-20">
          <div className="container-custom text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Fale Conosco</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Estamos prontos para ouvir você. Tire suas dúvidas, faça doações ou venha nos visitar.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-custom px-4">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <Card className="shadow-lg border-0 h-full">
                  <CardHeader className="border-b bg-white rounded-t-lg pb-6">
                    <CardTitle className="text-2xl text-primary">Envie sua mensagem</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 bg-white rounded-b-lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Nome Completo *</label>
                          <Input
                            name="nome"
                            required
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Ex: João da Silva"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                          <Input
                            name="telefone"
                            type="tel"
                            required
                            value={formData.telefone}
                            onChange={handleChange}
                            placeholder="(18) 99999-9999"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">E-mail *</label>
                        <Input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium text-gray-700">Mensagem *</label>
                          <span className="text-xs text-muted-foreground">{formData.mensagem.length}/500</span>
                        </div>
                        <Textarea
                          name="mensagem"
                          required
                          value={formData.mensagem}
                          onChange={handleChange}
                          placeholder="Como podemos ajudar você hoje?"
                          rows={6}
                          className="resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white gap-2"
                      >
                        <Send size={20} />
                        {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* COLUNA DA DIREITA: Informações */}
              <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
                <Card className="shadow-lg border-0 overflow-hidden">
                  <div className="bg-primary p-6">
                    <h3 className="font-bold text-xl text-white">Informações de Contato</h3>
                  </div>
                  <CardContent className="p-0 divide-y divide-gray-100">
                    <div className="p-6 flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary"><MapPin size={20} /></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Nosso Endereço</h4>
                        <p className="text-gray-600 text-sm">Rua Mário César de Camargo, 1345<br />Centro - Rancharia/SP</p>
                      </div>
                    </div>
                    <div className="p-6 flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary"><Phone size={20} /></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Contato</h4>
                        <p className="text-gray-600 text-sm">(18) 3265-1200</p>
                        <p className="text-gray-600 text-sm">contato@larfranciscofranco.com.br</p>
                      </div>
                    </div>
                    <div className="p-6 flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary"><Clock size={20} /></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Atendimento</h4>
                        <p className="text-gray-600 text-sm">Segunda a Sexta: 8h às 17h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors">
                  <a href="https://wa.me/551832651200" target="_blank" rel="noopener noreferrer" className="block p-6">
                    <div className="flex items-center gap-4">
                      <FaWhatsapp size={32} />
                      <div>
                        <h3 className="font-bold text-lg">WhatsApp</h3>
                        <p className="text-white/90 text-sm">Fale conosco em tempo real</p>
                      </div>
                    </div>
                  </a>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="h-[400px] w-full bg-gray-200 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.088899563258!2d-50.8953184!3d-22.2359556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94943b1a6a6f1d8b%3A0x6b8b8b8b8b8b8b8b!2sR.%20M%C3%A1rio%20C%C3%A9sar%20de%20Camargo%2C%201345%20-%20Centro%2C%20Rancharia%20-%20SP%2C%2019600-000!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Mapa"
            className="grayscale hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </section>
      </main>
    </div>
  );
};

export default Contato;