import Link from "next/link";
import { Shield, FileText, Scale, ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">Sinapsistencia</span>
            <span className="ml-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Plataforma Médico-Legal</span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            Ingresar al sistema
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
            <Shield className="h-3.5 w-3.5" />
            Plataforma de tesis – Universidad Peruana
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            Protección legal para<br />
            <span className="text-blue-600">profesionales de la salud</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Gestión documental clínica-legal con trazabilidad completa y vinculación directa entre médicos y abogados especializados en responsabilidad médica.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Acceder como médico
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Acceder como abogado
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-6 py-20 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            Dos módulos principales
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-5">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Gestión Documental Clínica-Legal</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Centraliza historias clínicas, consentimientos informados y documentación legal con control de versiones, firmas digitales y trazabilidad completa.
              </p>
              <ul className="space-y-2">
                {["Control de versiones de documentos", "Firmas digitales y huellas", "Trazabilidad de accesos", "Consentimientos informados"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center mb-5">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Vinculación Médico-Abogado</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Sistema de matching inteligente que conecta médicos con abogados especializados en responsabilidad médica según el perfil del caso.
              </p>
              <ul className="space-y-2">
                {["Matching por especialidad y caso", "Solicitudes de contacto", "Perfiles profesionales verificados", "Seguimiento de interacciones"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Acceso por rol</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Médico", desc: "Registra casos, gestiona documentos y busca asesoría legal especializada.", color: "blue" },
              { title: "Abogado", desc: "Recibe solicitudes, revisa casos y conecta con profesionales de la salud.", color: "slate" },
              { title: "Administrador", desc: "Gestiona usuarios, pacientes, documentación y supervisa la trazabilidad.", color: "emerald" },
            ].map((role) => (
              <div key={role.title} className="text-center p-6 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <div className={`h-12 w-12 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-white text-sm bg-${role.color}-600`}>
                  {role.title[0]}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{role.title}</h3>
                <p className="text-sm text-slate-500">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 Sinapsistencia – Proyecto de Tesis</span>
          <span>Plataforma Médico-Legal – Perú</span>
        </div>
      </footer>
    </div>
  );
}
