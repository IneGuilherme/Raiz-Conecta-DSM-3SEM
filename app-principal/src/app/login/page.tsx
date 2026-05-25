"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Building2,
  Clock,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function PaginaLogin() {
  const router = useRouter();

  // Três visões possíveis agora: login, cadastro, ou a tela bonita de espera
  const [view, setView] = useState<"login" | "cadastro" | "em_analise">(
    "login",
  );
  const [loading, setLoading] = useState(false);

  // Estados dos formulários
  const [formLogin, setFormLogin] = useState({ email: "", senha: "" });
  const [formCadastro, setFormCadastro] = useState({
    tipoUsuario: "produtor",
    nome: "",
    email: "",
    senha: "",
  });

  const tabs = [
    { id: "login", label: "Entrar", icon: LogIn },
    { id: "cadastro", label: "Criar Conta", icon: UserPlus },
  ];

  // ==========================================
  // LÓGICA DE LOGIN COM JWT E STATUS
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formLogin),
      });

      const data = await res.json();

      if (res.ok) {
        // Se estiver em análise, esconde o form e mostra o reloginho
        if (data.user.status === "EM_ANALISE") {
          setView("em_analise");
          return;
        }

        // Se APROVADO, guarda o crachá (JWT) e o nome para o Header
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.nome); // Mostra o NOME em vez do e-mail
        localStorage.setItem("userRole", data.user.tipoUser);

        window.dispatchEvent(new Event("storage")); // Atualiza o header

        toast.success(`Bem-vindo de volta, ${data.user.nome}!`);

        // Redireciona para o painel correto
        if (data.user.tipoUser === "admin") router.push("/admin");
        else if (data.user.tipoUser === "produtor") router.push("/produtor");
        else router.push("/mercado");
      } else {
        toast.error(data.error || "Erro ao fazer login.");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LÓGICA DO PRIMEIRO PASSO DO CADASTRO
  // ==========================================
  const handleCadastroPasso1 = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardamos o Passo 1 temporariamente para usar no Passo 2
    sessionStorage.setItem("cadastro_temporario", JSON.stringify(formCadastro));
    router.push("/completar-perfil");
  };

  return (
    <div className="min-h-[90vh] bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-120"
      >
        <Card className="shadow-2xl border border-gray-100 overflow-hidden bg-white">
          {/* SÓ MOSTRA AS ABAS SE NÃO ESTIVER NA TELA DE ANÁLISE */}
          {view !== "em_analise" && (
            <div className="p-1.5 bg-gray-100/80 rounded-full flex gap-1 relative m-6 mb-0 border border-gray-200">
              {tabs.map((tab) => {
                const isActive = view === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setView(tab.id as "login" | "cadastro")}
                    className={`flex-1 relative z-10 px-4 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${
                      isActive
                        ? "text-green-700"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-white rounded-full shadow-md"
                        transition={{
                          type: "spring",
                          duration: 0.5,
                          bounce: 0.2,
                        }}
                      />
                    )}
                    <tab.icon size={16} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="p-8 md:p-10 space-y-8 relative min-h-100 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* TELA 1: LOGIN */}
              {view === "login" && (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-gray-950 leading-tight">
                      Bem-vindo de volta!
                    </h1>
                    <p className="text-gray-600">
                      Acesse sua conta para gerenciar seus negócios.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <Input
                      label="E-mail"
                      name="email"
                      type="email"
                      icon={Mail}
                      placeholder="seu@email.com"
                      value={formLogin.email}
                      onChange={(e) =>
                        setFormLogin({ ...formLogin, email: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Senha"
                      name="senha"
                      type="password"
                      icon={Lock}
                      placeholder="********"
                      value={formLogin.senha}
                      onChange={(e) =>
                        setFormLogin({ ...formLogin, senha: e.target.value })
                      }
                      required
                    />
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-xs text-green-600 hover:text-green-700 font-bold hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <Button
                      type="submit"
                      isLoading={loading}
                      className="w-full h-12 text-lg mt-2"
                    >
                      Acessar Painel
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* TELA 2: CADASTRO INICIAL */}
              {view === "cadastro" && (
                <motion.div
                  key="cadastro-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-gray-950 leading-tight">
                      Junte-se a nós
                    </h1>
                    <p className="text-gray-600">
                      Crie sua conta e conecte-se direto da fonte.
                    </p>
                  </div>

                  <form onSubmit={handleCadastroPasso1} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Building2 size={16} />
                        Tipo de Perfil
                      </label>
                      <select
                        value={formCadastro.tipoUsuario}
                        onChange={(e) =>
                          setFormCadastro({
                            ...formCadastro,
                            tipoUsuario: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 bg-white text-sm outline-none"
                      >
                        <option value="produtor">Sou Produtor Rural</option>
                        <option value="mercado">
                          Sou Mercado / Supermercado
                        </option>
                      </select>
                    </div>

                    <Input
                      label="Nome Fantasia / Razão Social"
                      name="nome"
                      type="text"
                      icon={User}
                      placeholder="Fazenda São João"
                      value={formCadastro.nome}
                      onChange={(e) =>
                        setFormCadastro({
                          ...formCadastro,
                          nome: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="E-mail"
                      name="email"
                      type="email"
                      icon={Mail}
                      placeholder="seu@email.com"
                      value={formCadastro.email}
                      onChange={(e) =>
                        setFormCadastro({
                          ...formCadastro,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Senha"
                      name="password"
                      type="password"
                      icon={Lock}
                      placeholder="Crie uma senha forte"
                      value={formCadastro.senha}
                      onChange={(e) =>
                        setFormCadastro({
                          ...formCadastro,
                          senha: e.target.value,
                        })
                      }
                      required
                    />

                    <div className="flex items-start gap-2.5 text-xs text-gray-600 pt-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 accent-green-600 rounded"
                        required
                      />
                      <label>
                        Li e concordo com os{" "}
                        <a
                          href="#"
                          className="text-green-600 font-bold hover:underline"
                        >
                          Termos de Uso
                        </a>{" "}
                        e{" "}
                        <a
                          href="#"
                          className="text-green-600 font-bold hover:underline"
                        >
                          Política de Privacidade
                        </a>
                        .
                      </label>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg mt-2">
                      Avançar para o Passo 2
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* TELA 3: CONTA EM ANÁLISE (O TOQUE DE MESTRE DA UX) */}
              {view === "em_analise" && (
                <motion.div
                  key="em-analise"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="text-center space-y-6 py-4"
                >
                  <div className="mx-auto w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6">
                    <Clock size={48} className="animate-pulse" />
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 leading-tight">
                    Conta em Análise
                  </h1>
                  <p className="text-gray-600 leading-relaxed px-4">
                    Sua documentação está sob análise. Fique de olho no seu{" "}
                    <strong className="text-gray-900">E-mail</strong>,
                    avisaremos por lá assim que seu acesso for liberado!
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setView("login");
                      setFormLogin({ email: "", senha: "" }); // Limpa o form ao voltar
                    }}
                    className="mt-8 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <ArrowLeft size={18} className="mr-2" /> Voltar para o Login
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {view !== "em_analise" && (
            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
              Precisa de ajuda com o acesso?{" "}
              <a href="#" className="text-green-600 font-bold hover:underline">
                Fale com o suporte.
              </a>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
