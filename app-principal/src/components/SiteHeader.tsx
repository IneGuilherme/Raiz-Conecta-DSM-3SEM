"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, LogOut, User, ShieldAlert, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SiteHeader() {
  const [role, setRole] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Função blindada para ler quem está logado
  const carregarUsuario = () => {
    const token = localStorage.getItem("token"); // O JWT é a fonte da verdade!

    // Se não tiver token, não importa o que tem no nome/role, ele está deslogado.
    if (!token) {
      setRole(null);
      setNome(null);
      return;
    }

    setRole(localStorage.getItem("userRole"));
    setNome(localStorage.getItem("userName"));
  };

  useEffect(() => {
    carregarUsuario();

    // Escuta mudanças no navegador para atualizar o Header em tempo real
    window.addEventListener("storage", carregarUsuario);
    window.addEventListener("loginStateChange", carregarUsuario);

    return () => {
      window.removeEventListener("storage", carregarUsuario);
      window.removeEventListener("loginStateChange", carregarUsuario);
    };
  }, [pathname]);

  const handleLogout = () => {
    // 1. Limpa o Frontend
    localStorage.clear();
    setRole(null);
    setNome(null);

    // 2. DELETA O COOKIE PARA O MIDDLEWARE SABER QUE DESLOGOU
    document.cookie = "token=; path=/; max-age=0;";

    // 3. Atualiza a tela e joga pro login
    window.dispatchEvent(new Event("loginStateChange"));
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-350 mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-green-100 p-2 rounded-xl group-hover:bg-green-600 transition-colors">
            <Leaf
              className="text-green-600 group-hover:text-white transition-colors"
              size={28}
            />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            Raiz<span className="text-green-600">Conecta</span>
          </span>
        </Link>

        {/* MENUS DINÂMICOS */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-gray-600">
          {!role && (
            <>
              <Link href="/#sobre" className="hover:text-green-600 transition">
                Sobre o Projeto
              </Link>
              <Link
                href="/#funcionalidades"
                className="hover:text-green-600 transition"
              >
                Vantagens
              </Link>
              <Link
                href="/#como-funciona"
                className="hover:text-green-600 transition"
              >
                Como Funciona
              </Link>
            </>
          )}

          {/* Menus logados: Produtor / Mercado */}
          {(role === "mercado" || role === "produtor") && (
            <>
              <Link
                href={role === "mercado" ? "/catalogo" : "/produtor"}
                className="flex items-center gap-2 hover:text-green-600 transition text-gray-800"
              >
                <LayoutDashboard size={18} />
                {role === "mercado" ? "Painel de Compras" : "Painel de Vendas"}
              </Link>
              <Link
                href="/perfil"
                className="flex items-center gap-2 hover:text-green-600 transition text-gray-800"
              >
                <User size={18} /> Meu Perfil
              </Link>
            </>
          )}

          {/* Menus logados: Admin */}
          {role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition"
            >
              <ShieldAlert size={18} /> Central Admin
            </Link>
          )}
        </nav>

        {/* BOTÕES DA DIREITA (ARRUMADO PARA MOBILE) */}
        <div className="flex items-center gap-4">
          {!role ? (
            // Apenas UM botão para acessar/cadastrar (resolve o mobile)
            <Button
              onClick={() => router.push("/login")}
              className="bg-green-600 hover:bg-green-700 shadow-md font-bold h-11 px-6"
            >
              Acessar Conta
            </Button>
          ) : (
            // Usuário Logado
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
                  {role}
                </p>
                <p className="text-sm font-black text-gray-800 leading-none">
                  {nome || "Usuário"}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 h-10 px-3 md:px-4 transition-colors"
              >
                {/* No mobile só aparece o ícone de sair, no desktop aparece "Sair" */}
                <LogOut size={18} className="md:mr-2" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
