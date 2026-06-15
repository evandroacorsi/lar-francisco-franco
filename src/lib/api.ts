export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    if (text.trim().startsWith("<?php")) {
      throw new Error(
        "A API PHP nao esta sendo executada. Em desenvolvimento use um servidor com PHP, e em producao publique o dist em uma hospedagem com PHP habilitado.",
      );
    }

    throw new Error(text || `Resposta invalida da API (${response.status}).`);
  }

  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || `Erro HTTP ${response.status}`);
  }

  return data;
}
