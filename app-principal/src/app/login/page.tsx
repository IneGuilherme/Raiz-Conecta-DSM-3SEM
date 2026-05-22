"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, User, Building2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function PaginaLogin() {
    // Estado para controlar qual aba está ativa (Entrar ou Criar Conta)
    const [view, setView] = useState<"login" | "cadastro">("login");

    // Definição das abas para animação fluida
    const tabs = [
        { id: "login", label: "Entrar", icon: LogIn },
        { id: "cadastro", label: "Criar Conta", icon: UserPlus },
    ];

    return (
        <div className="min-h-[90vh] bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-8">

            {/* CONTAINER DO CARD COM ANIMAÇÃO DE ENTRADA (TEMPLATE JÁ FAZ, MAS REFORÇAMOS) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[480px]"
            >
                <Card className="shadow-2xl border border-gray-100 overflow-hidden">

                    {/* 1. SELETOR DE ABAS TIPO PÍLULA (MODERNO E ANIMADO) */}
                    <div className="p-1.5 bg-gray-100/80 rounded-full flex gap-1 relative m-6 mb-0 border border-gray-200">
                        {tabs.map((tab) => {
                            const isActive = view === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setView(tab.id as "login" | "cadastro")}
                                    className={`flex-1 relative z-10 px-4 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${isActive ? "text-green-700" : "text-gray-500 hover:text-gray-800"
                                        }`}
                                >
                                    {/* Fundo Deslizante Mágico (Framer Motion shared layout) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabPill"
                                            className="absolute inset-0 bg-white rounded-full shadow-md"
                                            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                                        />
                                    )}
                                    <tab.icon size={16} className="relative z-10" />
                                    <span className="relative z-10">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 2. CONTEÚDO DO FORMULÁRIO COM ESPAÇAMENTO CORRETO (PADDINGS AJUSTADOS) */}
                    <div className="p-8 md:p-10 space-y-8 relative">

                        {/* ANIMAÇÃO DE CONTEÚDO (ANIMATE PRESENCE PARA TROCA FLUIDA) */}
                        <AnimatePresence mode="wait">
                            {view === "login" ? (
                                // --- FORMULÁRIO DE LOGIN ---
                                <motion.div
                                    key="login-form"
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 15 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center space-y-2">
                                        <h1 className="text-3xl font-black text-gray-950 leading-tight">Bem-vindo de volta!</h1>
                                        <p className="text-gray-600">Acesse sua conta para gerenciar seus negócios.</p>
                                    </div>

                                    <form className="space-y-5">
                                        <Input label="E-mail" name="email" type="email" icon={Mail} placeholder="seu@email.com" required />
                                        <Input label="Senha" name="password" type="password" icon={Lock} placeholder="********" required />
                                        <div className="text-right">
                                            <a href="#" className="text-xs text-green-600 hover:text-green-700 font-bold hover:underline">Esqueceu a senha?</a>
                                        </div>
                                        <Button type="submit" className="w-full h-12 text-lg mt-2">Acessar Painel</Button>
                                    </form>
                                </motion.div>
                            ) : (
                                // --- FORMULÁRIO DE CADASTRO ---
                                <motion.div
                                    key="cadastro-form"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center space-y-2">
                                        <h1 className="text-3xl font-black text-gray-950 leading-tight">Junte-se a nós</h1>
                                        <p className="text-gray-600">Crie sua conta e conecte-se direto da fonte.</p>
                                    </div>

                                    <form className="space-y-5">
                                        {/* Exemplo de Select Modernizado (Ainda precisa do componente Select UI) */}
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Building2 size={16} />Tipo de Perfil</label>
                                            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 bg-white text-sm outline-none">
                                                <option value="produtor">Sou Produtor Rural</option>
                                                <option value="mercado">Sou Mercado / Supermercado</option>
                                            </select>
                                        </div>

                                        <Input label="Nome Completo / Razão Social" name="nome" type="text" icon={User} placeholder="João da Silva" required />
                                        <Input label="E-mail" name="email" type="email" icon={Mail} placeholder="seu@email.com" required />
                                        <Input label="Senha" name="password" type="password" icon={Lock} placeholder="Crie uma senha forte" required />

                                        <div className="flex items-start gap-2.5 text-xs text-gray-600 pt-2">
                                            <input type="checkbox" className="mt-0.5 accent-green-600 rounded" required />
                                            <label>Li e concordo com os <a href="#" className="text-green-600 font-bold hover:underline">Termos de Uso</a> e <a href="#" className="text-green-600 font-bold hover:underline">Política de Privacidade</a>.</label>
                                        </div>

                                        <Button type="submit" className="w-full h-12 text-lg mt-2">Avançar para o Passo 2</Button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RODAPÉ DO CARD ADICIONADO PARA DAR MAIS RESPIRAR E CONTEXTO */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
                        Precisa de ajuda com o acesso? <a href="#" className="text-green-600 font-bold hover:underline">Fale com o suporte.</a>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}