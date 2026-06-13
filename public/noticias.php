<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

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
$DATABASE_ID  = getenv('DATABASE_ID');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// === GET ===
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 6;
$cursor = $_GET['cursor'] ?? null;
$search = $_GET['search'] ?? null;
$categoria = $_GET['categoria'] ?? null;

$body = [
    "sorts" => [["property" => "Data", "direction" => "descending"]],
    "page_size" => $limit
];
if ($cursor) $body["start_cursor"] = $cursor;

$filters = [];
if ($search) $filters[] = ["property" => "Título", "title" => ["contains" => $search]];
if ($categoria) $filters[] = ["property" => "Categoria", "multi_select" => ["contains" => $categoria]];
if (!empty($filters)) $body["filter"] = ["and" => $filters];

$ch = curl_init("https://api.notion.com/v1/databases/$DATABASE_ID/query");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => 0,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $NOTION_TOKEN",
        "Notion-Version: 2022-06-28",
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($body),
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if (isset($data['object']) && $data['object'] === 'error') {
    http_response_code($httpCode);
    echo json_encode(["error" => "Erro Notion", "details" => $data, "noticias" => []]);
    exit;
}

$noticias = [];
if (isset($data['results'])) {
    foreach ($data['results'] as $item) {
        $props = $item['properties'];

        // --- CORREÇÃO AQUI: LOOP PARA PEGAR TODAS AS IMAGENS ---
        $todasImagens = [];
        if (!empty($props['Imagem']['files'])) {
            foreach($props['Imagem']['files'] as $fileObj) {
                $url = $fileObj['file']['url'] ?? $fileObj['external']['url'] ?? null;
                if ($url) {
                    $todasImagens[] = $url;
                }
            }
        }

        // Pega a primeira imagem para ser a capa (Thumb)
        $capa = $todasImagens[0] ?? null;

        $noticias[] = [
            'id' => $item['id'],
            'titulo' => $props['Título']['title'][0]['plain_text'] ?? 'Sem título',
            'categoria' => array_map(fn($c) => $c['name'], $props['Categoria']['multi_select'] ?? []),
            'descricao' => $props['Descrição']['rich_text'][0]['plain_text'] ?? '',
            'conteudo' => $props['Conteúdo']['rich_text'][0]['plain_text'] ?? '',

            // Enviamos os dois formatos:
            'imagem' => $capa,        // String (para o Card da lista)
            'imagens' => $todasImagens, // Array (para o Dialog de edição)

            'data' => $props['Data']['date']['start'] ?? $item['created_time'],
            'visualizacoes' => $props['Visualizações']['number'] ?? 0,
        ];
    }
}

echo json_encode([
    "noticias" => $noticias,
    "next_cursor" => $data['next_cursor'] ?? null
], JSON_UNESCAPED_UNICODE);
?>
