<?php
require_once __DIR__ . '/api/_bootstrap.php';

// Desative a exibição de erros para não quebrar o JSON de resposta
ini_set('display_errors', 0);
error_reporting(E_ALL);

date_default_timezone_set('America/Sao_Paulo');
header('Content-Type: application/json; charset=UTF-8');

// --- CONFIGURAÇÃO DE CORES DA MARCA ---
$corPrimaria = "#2563EB";
$corFundo     = "#F3F4F6";
$corTexto     = "#1F2937";
$corBranca    = "#FFFFFF";
// --------------------------------------

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    api_rate_limit('contact-minute:' . api_client_ip(), 2, 60);
    api_rate_limit('contact-hour:' . api_client_ip(), 10, 3600);
    api_verify_turnstile($_POST["turnstileToken"] ?? '', 'contato');

    // IMPORTANTE: Ajustado para bater com os nomes do seu 'formData' no React
    $nome     = htmlspecialchars($_POST["nome"] ?? '', ENT_QUOTES, 'UTF-8');
    $email    = filter_var($_POST["email"] ?? '', FILTER_SANITIZE_EMAIL);
    $telefone = htmlspecialchars($_POST["telefone"] ?? '', ENT_QUOTES, 'UTF-8');
    $mensagem = htmlspecialchars($_POST["mensagem"] ?? '', ENT_QUOTES, 'UTF-8');

    $length = fn (string $value): int => function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);

    if ($length($nome) < 3 || $length($nome) > 120) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Nome inválido."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $length($email) > 180) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "E-mail inválido."]);
        exit;
    }

    if ($length($telefone) < 10 || $length($telefone) > 20) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Telefone inválido."]);
        exit;
    }

    if ($length($mensagem) < 10 || $length($mensagem) > 3000) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Mensagem inválida."]);
        exit;
    }

    $to = "larfranciscofranco@hotmail.com";
    $subject = "📬 Novo contato via site - Lar Francisco Franco";
    $dataHora = date("d/m/Y H:i:s");

    // Montando o corpo HTML de forma limpa para evitar erro de sintaxe
    $body = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='UTF-8'></head>
    <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: $corFundo; color: $corTexto;'>
        <div style='max-width: 600px; margin: 40px auto; background-color: $corBranca; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
            <div style='background-color: $corPrimaria; padding: 24px; text-align: center;'>
                <h2 style='color: $corBranca; margin: 0; font-size: 24px;'>Nova Mensagem</h2>
                <p style='color: $corBranca; margin: 5px 0 0; opacity: 0.9; font-size: 14px;'>Portal Lar Francisco Franco</p>
            </div>
            <div style='padding: 30px;'>
                <p style='font-size: 16px;'>Olá, você recebeu um novo contato:</p>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding: 10px 0; border-bottom: 1px solid #eee; width: 140px;'><strong>Data/Hora:</strong></td>
                        <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$dataHora</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px 0; border-bottom: 1px solid #eee;'><strong>Nome:</strong></td>
                        <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$nome</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px 0; border-bottom: 1px solid #eee;'><strong>E-mail:</strong></td>
                        <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$email</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px 0; border-bottom: 1px solid #eee;'><strong>Telefone:</strong></td>
                        <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$telefone</td>
                    </tr>
                </table>
                <div style='margin-top: 25px;'>
                    <p style='font-weight: bold; margin-bottom: 8px;'>Mensagem:</p>
                    <div style='background: #f9fafb; border-left: 4px solid $corPrimaria; padding: 15px; border-radius: 4px;'>
                        " . nl2br($mensagem) . "
                    </div>
                </div>
                <div style='margin-top: 30px; text-align: center;'>
                    <a href='mailto:$email' style='background-color: $corPrimaria; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>Responder por E-mail</a>
                </div>
            </div>
            <div style='background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;'>
                <p style='margin: 0;'>Mensagem automática do sistema Lar Francisco Franco.</p>
            </div>
        </div>
    </body>
    </html>";

    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
    // O FROM DEVE ser um e-mail do domínio para a HostGator não bloquear
    $headers .= "From: Site Lar <contato@larfranciscofranco.com.br>" . "\r\n";
    $headers .= "Reply-To: " . str_replace(["\r", "\n"], '', $email) . "\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Mensagem enviada!"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Erro ao processar envio pelo servidor."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método não permitido."]);
}
?>
