<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$envPath = __DIR__ . '/.env';

if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $value] = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}

$NOTION_TOKEN = getenv('NOTION_TOKEN');

$id = $_GET['id'] ?? null;
$increment = $_GET['increment'] ?? "false";

function extrairRichText($prop) {
    if (!isset($prop['rich_text']) || empty($prop['rich_text'])) {
        return "";
    }

    $texto = "";
    foreach ($prop['rich_text'] as $t) {
        $texto .= ($t['plain_text'] ?? '');
    }

    return trim($texto);
}


if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "ID da notícia é obrigatório"]);
    exit;
}

// 1️⃣ Busca a página no Notion (Propriedades)
$ch = curl_init("https://api.notion.com/v1/pages/$id");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $NOTION_TOKEN",
        "Notion-Version: 2022-06-28"
    ]
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$page = json_decode($response, true);

// Verifica se deu erro (ex: 404 não encontrado ou 401 não autorizado)
if ($httpCode !== 200 || (isset($page['object']) && $page['object'] === 'error')) {
    http_response_code($httpCode);
    echo json_encode(["error" => $page['message'] ?? "Erro desconhecido ao buscar página"]);
    exit;
}

$props = $page['properties'];

// 🔹 Pega todas as imagens
$imagens = [];
if (isset($props['Imagem']['files']) && count($props['Imagem']['files']) > 0) {
    foreach ($props['Imagem']['files'] as $f) {
        // Notion devolve 'file' (upload) ou 'external' (link)
        $url = $f['file']['url'] ?? $f['external']['url'] ?? null;
        if ($url) $imagens[] = $url;
    }
}

$imagem = $imagens[0] ?? "";

// 2️⃣ Incrementa visualizações (Opcional)
if ($increment === "true") {
    $visualizacoes = $props['Visualizações']['number'] ?? 0;

    $body = [
        "properties" => [
            "Visualizações" => ["number" => $visualizacoes + 1]
        ]
    ];

    $ch = curl_init("https://api.notion.com/v1/pages/$id");
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => "PATCH",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $NOTION_TOKEN",
            "Notion-Version: 2022-06-28",
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => json_encode($body)
    ]);
    curl_exec($ch);
    curl_close($ch);
}


$conteudo  = extrairRichText($props['Conteúdo']   ?? []);
$conteudo2 = extrairRichText($props['Conteudo2'] ?? []);
$conteudo3 = extrairRichText($props['Conteudo3'] ?? []);



$noticia = [
    "id" => $page['id'],
    "titulo" => $props['Título']['title'][0]['plain_text'] ?? "Sem título",
    "descricao" => $props['Descrição']['rich_text'][0]['plain_text'] ?? "",
    "conteudo"  => $conteudo,
    "conteudo2" => $conteudo2,
    "conteudo3" => $conteudo3,
    "data" => $props['Data']['date']['start'] ?? "",
    "categoria" => array_map(fn($c) => $c['name'], $props['Categoria']['multi_select'] ?? []),
    "imagem" => $imagem,
    "imagens" => $imagens,
    "visualizacoes" => isset($props['Visualizações']['number']) ? $props['Visualizações']['number'] : 0
];

echo json_encode($noticia, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);