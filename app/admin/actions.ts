"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchScreenshot } from "@/lib/screenshot";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Preencha e-mail e senha." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 6)
    return { error: "Senha precisa ter pelo menos 6 caracteres." };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: translateAuthError(error.message) };

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/admin");
  }
  return { info: "Conta criada. Confira seu e-mail pra confirmar (ou desative a confirmação em Supabase → Authentication → Providers → Email)." };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export async function createProject(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const name = String(formData.get("name") ?? "").trim();
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name || !url) return { error: "Nome e URL são obrigatórios." };

  const screenshot_url = await fetchScreenshot(url);

  const { data: maxRow } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("projects").insert({
    name,
    url,
    description,
    screenshot_url,
    sort_order: nextOrder,
  });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const name = String(formData.get("name") ?? "").trim();
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name || !url) return { error: "Nome e URL são obrigatórios." };

  const { error } = await supabase
    .from("projects")
    .update({ name, url, description })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function regenerateScreenshot(id: string, url: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const screenshot_url = await fetchScreenshot(url);
  if (!screenshot_url) return { error: "Não deu pra gerar o screenshot agora." };

  const { error } = await supabase
    .from("projects")
    .update({ screenshot_url })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, screenshot_url };
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function moveProject(id: string, direction: "up" | "down") {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: all } = await supabase
    .from("projects")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (!all) return { error: "Sem dados." };
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return { error: "Não encontrado." };
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return { ok: true };

  const a = all[idx];
  const b = all[swapIdx];
  await supabase.from("projects").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("projects").update({ sort_order: a.sort_order }).eq("id", b.id);

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function translateAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha inválidos.";
  if (m.includes("email not confirmed")) return "E-mail não confirmado. Confira sua caixa de entrada.";
  if (m.includes("already registered")) return "Esse e-mail já tem conta. Faça login.";
  return msg;
}
