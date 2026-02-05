import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import logoSrc from '../assets/logo.webp'; // Ajuste seu import

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom px-2 pt-12 pb-8 mx-auto">

        {/* LAYOUT PRINCIPAL: Dividido em Esquerda (Logo) e Direita (Conteúdo) */}
        <div className="flex flex-col lg:flex-row">

          <div className="w-full lg:w-1/4 flex flex-col items-center text-center space-y-6 lg:border-r-2 border-white/10 justify-center pb-6">

            {/* Logo */}
            <img
              src={logoSrc}
              alt="Logo Lar Francisco Franco"
              className="h-48 w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />

            <div>
              <h3 className="font-bold text-xl leading-tight">Lar Francisco Franco</h3>
              <p className="text-xs text-primary-foreground/60 mt-1 uppercase tracking-wider">"Casa das Meninas"</p>
            </div>

            {/* Redes Sociais */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/larfranciso.franco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:-translate-y-1"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/larffranco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:-translate-y-1"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* === BLOCO DIREITA: Conteúdo === */}
          <div className="w-full lg:w-3/4 flex flex-col justify-between align-center px-8 pb-10">

            {/* 1. Texto de Descrição no TOPO para preencher o espaço vazio */}
            <div className="pb-8 border-b border-white/10 flex align-center justify-center">
              <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-2xl text-center lg:text-center mx-auto lg:mx-0 ">
                Somos uma OSC de atendimento para crianças e adolescentes de 6 a 15 anos.
                Promovendo amor, cuidado, respeito e dedicação para transformar futuros.
              </p>
            </div>

            {/* 2. Grid das Informações (Navegação, Contato, Horário) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">

              {/* Navegação */}
              <div className="">
                <h3 className="font-bold text-lg mb-4 text-white">Navegação</h3>
                <nav className="flex flex-col gap-3">
                  <Link to="/sobre" className="text-primary-foreground/70 hover:text-white transition-colors">Sobre Nós</Link>
                  <Link to="/transparencia" className="text-primary-foreground/70 hover:text-white transition-colors">Transparência</Link>
                  <Link to="/noticias" className="text-primary-foreground/70 hover:text-white transition-colors">Noticias</Link>
                  <Link to="/como-ajudar" className="text-primary-foreground/70 hover:text-white transition-colors">Como Ajudar</Link>
                </nav>
              </div>

              {/* Contato */}
              <div className="lg:text-left">
                <h3 className="font-bold text-lg mb-4 text-white">Contato</h3>
                <div className="flex flex-col gap-4 items-start lg:items-start">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-1 text-secondary shrink-0" />
                    <p className="text-sm text-primary-foreground/70 text-start">
                      Rua Mário César de Camargo, 1345<br />
                      Centro, Rancharia/SP
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-secondary shrink-0" />
                    <p className="text-sm text-primary-foreground/70">(18) 3265-1200</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-secondary shrink-0" />
                    <p className="text-sm text-primary-foreground/70">contato@larfranciscofranco.com.br</p>
                  </div>
                </div>
              </div>

              {/* Atendimento / Card */}
              <div>
                <h3 className="font-bold text-lg mb-4">Outras informações</h3>
                <p className="text-sm text-primary-foreground/80 mb-3">
                  <strong>Atendimento de Segunda a Sexta:</strong><br />
                  08h às 17h
                </p>
                <p className="text-sm text-primary-foreground/80 mb-3">
                  <strong>Razão Social:</strong> Lar Francisco Franco - "Casa das Meninas"
                </p>
                <p className="text-sm text-primary-foreground/80 mb-3">
                  <strong>CNPJ:</strong> 55.687.404/0001-97
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/40 text-center">
          <p>© {currentYear} Lar Francisco Franco. Todos os direitos reservados.</p>
          <p>Desenvolvido por <a href="https://evandroacorsi.dev"><strong>evandroacorsi.dev</strong></a></p>
        </div>

      </div>
    </footer>
  );
};