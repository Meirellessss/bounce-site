// Usa a API pública do microlink pra gerar screenshot de uma URL.
// Tier free: 50 requests/dia por IP — mais que suficiente pra cadastrar projetos.
export async function fetchScreenshot(url: string): Promise<string | null> {
  try {
    const endpoint = new URL("https://api.microlink.io/");
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("screenshot", "true");
    endpoint.searchParams.set("meta", "false");
    endpoint.searchParams.set("viewport.width", "1440");
    endpoint.searchParams.set("viewport.height", "900");
    endpoint.searchParams.set("waitUntil", "networkidle0");

    const res = await fetch(endpoint.toString(), { cache: "no-store" });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      status?: string;
      data?: { screenshot?: { url?: string } };
    };
    return json?.data?.screenshot?.url ?? null;
  } catch {
    return null;
  }
}
