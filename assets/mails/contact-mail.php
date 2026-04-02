<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=UTF-8');

function loadEnvValues(string $filePath): array
{
    if (!is_file($filePath)) {
        return [];
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return [];
    }

    $values = [];
    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || str_starts_with($trimmed, '#')) {
            continue;
        }

        $parts = explode('=', $trimmed, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = trim($parts[0]);
        $value = trim($parts[1]);
        $value = trim($value, "\"'");
        if ($key !== '') {
            $values[$key] = $value;
        }
    }

    return $values;
}

$env = loadEnvValues(__DIR__ . '/.env');
$SMTP_HOST = trim((string) ($env['SMTP_HOST'] ?? 'smtp.office365.com'));
$SMTP_PORT = (int) ($env['SMTP_PORT'] ?? 587);
$SMTP_SECURE = trim((string) ($env['SMTP_SECURE'] ?? 'starttls'));
$SMTP_USERNAME = trim((string) ($env['SMTP_USERNAME'] ?? ''));
$SMTP_PASSWORD = trim((string) ($env['SMTP_PASSWORD'] ?? ''));
$FROM_EMAIL = trim((string) ($env['SMTP_FROM_EMAIL'] ?? ''));
$FROM_NAME = trim((string) ($env['SMTP_FROM_NAME'] ?? 'Website Enquiry'));
$RECIPIENTS = [
    ['email' => 'aakash@pivotmkg.com', 'name' => 'Aakash'],
];

function jsonResponse(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

function ensurePostRequest(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        jsonResponse(405, [
            'ok' => false,
            'message' => 'Method not allowed.',
        ]);
    }
}

function requestMetaLines(): array
{
    return [
        'Submitted at: ' . gmdate('Y-m-d H:i:s') . ' UTC',
        // 'User agent: ' . (string) ($_SERVER['HTTP_USER_AGENT'] ?? 'Unavailable'),
    ];
}

function safeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function hasVisibleText(string $value): bool
{
    return preg_match('/\S/u', $value) === 1;
}

function logMailError(string $detail): void
{
    $message = trim($detail);
    if ($message === '') {
        return;
    }
    error_log('[TruBoard Mail][contact-mail.php] ' . $message);
}

function publicMailErrorMessage(): string
{
    return 'Technical error. Please try again later.';
}

function requireMailerAutoload(): void
{
    $autoload = __DIR__ . '/vendor/autoload.php';
    if (!is_file($autoload)) {
        logMailError('PHPMailer dependency is missing. Deploy assets/mails/vendor or run composer install in assets/mails.');
        jsonResponse(500, [
            'ok' => false,
            'message' => publicMailErrorMessage(),
        ]);
    }
    require_once $autoload;
}

function configureMailer(?string $replyTo = null): PHPMailer
{
    requireMailerAutoload();

    if ($GLOBALS['SMTP_USERNAME'] === '' || $GLOBALS['SMTP_PASSWORD'] === '' || $GLOBALS['FROM_EMAIL'] === '') {
        logMailError('Mail service is not fully configured on this server.');
        jsonResponse(500, [
            'ok' => false,
            'message' => publicMailErrorMessage(),
        ]);
    }

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->CharSet = 'UTF-8';
    $mail->Host = $GLOBALS['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $GLOBALS['SMTP_USERNAME'];
    $mail->Password = $GLOBALS['SMTP_PASSWORD'];
    $mail->Port = $GLOBALS['SMTP_PORT'];
    $mail->SMTPSecure = $GLOBALS['SMTP_SECURE'] === 'starttls'
        ? PHPMailer::ENCRYPTION_STARTTLS
        : (string) $GLOBALS['SMTP_SECURE'];
    $mail->Timeout = 20;
    $mail->setFrom($GLOBALS['FROM_EMAIL'], $GLOBALS['FROM_NAME']);

    $recipientCount = 0;
    foreach ($GLOBALS['RECIPIENTS'] as $recipient) {
        $email = trim((string) ($recipient['email'] ?? ''));
        $name = trim((string) ($recipient['name'] ?? ''));
        if ($email === '') {
            continue;
        }
        $mail->addAddress($email, $name);
        $recipientCount++;
    }

    if ($recipientCount === 0) {
        logMailError('Mail service recipient list is empty on this server.');
        jsonResponse(500, [
            'ok' => false,
            'message' => publicMailErrorMessage(),
        ]);
    }

    if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($replyTo);
    }

    return $mail;
}

function sendMail(string $subject, string $htmlBody, string $altBody, ?string $replyTo = null): bool
{
    try {
        $mail = configureMailer($replyTo);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = $altBody;
        return $mail->send();
    } catch (Exception $exception) {
        $detail = isset($mail) && $mail instanceof PHPMailer ? $mail->ErrorInfo : $exception->getMessage();
        logMailError($detail);
        return false;
    }
}

ensurePostRequest();

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$inquiryType = trim((string) ($_POST['inquiry_type'] ?? ''));
$routing = trim((string) ($_POST['routing'] ?? $_POST['route'] ?? 'general_inquiries'));

$routeConfig = [
    'general_inquiries' => [
        'subject' => 'New Contact Us inquiry: General Inquiries',
        'success_message' => 'Thanks for your inquiry. Our team will get back to you shortly.',
    ],
    'services_engagements' => [
        'subject' => 'New Contact Us inquiry: Services Engagements',
        'success_message' => 'Thanks. Your mandate discussion request has been sent to our Services team.',
    ],
    'trugenie_demo_requests' => [
        'subject' => 'New Contact Us inquiry: TruGenie Demo Requests',
        'success_message' => 'Thanks. Our product team will contact you to schedule a TruGenie demo.',
    ],
];

$selectedRoute = $routeConfig[$routing] ?? [
    'subject' => 'New Contact Us inquiry',
    'success_message' => 'Thanks. Your request has been received.',
];

$name = trim((string) preg_replace('/\s+/u', ' ', $name));
$email = trim($email);
$message = trim($message);

if (!hasVisibleText($name)) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter your name.',
    ]);
}

if (strlen($name) > 120) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Name must be 120 characters or fewer.',
    ]);
}

if ($email === '' || strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter a valid email address.',
    ]);
}

if (!hasVisibleText($message)) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter your requirement details.',
    ]);
}

if (strlen($message) > 3000) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Message must be 3000 characters or fewer.',
    ]);
}

if ($inquiryType === '') {
    $inquiryType = 'Website Inquiry';
}

$metaLines = requestMetaLines();
$bodyLines = [
    'A new Contact Us request was submitted from the website.',
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'Inquiry type: ' . $inquiryType,
    'Routing key: ' . $routing,
    '',
    'Message:',
    $message,
    '',
];

$bodyLines = array_merge($bodyLines, $metaLines);
$altBody = implode("\r\n", $bodyLines);

$safeName = safeHtml($name);
$safeEmail = safeHtml($email);
$safeInquiryType = safeHtml($inquiryType);
$safeRouting = safeHtml($routing);
$safeMessage = nl2br(safeHtml($message), false);
$safeSubmittedAt = safeHtml($metaLines[0] ?? 'Submitted at: Unavailable');

$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Request</title>
</head>
<body style="margin:0; padding:24px; background:#f5f7fb; font-family:Arial, Helvetica, sans-serif; color:#10233f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px; border-collapse:collapse; background:#ffffff; border:1px solid #dbe4f0; border-radius:14px; overflow:hidden;">
                    <tr>
                        <td style="padding:20px 24px; background:#10233f; color:#ffffff;">
                            <p style="margin:0; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; opacity:0.85;">TruBoard Technologies</p>
                            <h1 style="margin:8px 0 0; font-size:22px; line-height:1.3; font-weight:700;">New Contact Request</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 24px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse; background:#f7faff; border:1px solid #dbe4f0; border-radius:10px;">
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90; width:165px;">Name</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeName}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Email</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeEmail}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Inquiry Type</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeInquiryType}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Routing Key</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeRouting}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Submitted At</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:14px; color:#10233f;">{$safeSubmittedAt}</td></tr>
                            </table>
                            <h2 style="margin:18px 0 8px; font-size:15px; color:#10233f;">Message</h2>
                            <p style="margin:0; font-size:14px; line-height:1.6; color:#344764;">{$safeMessage}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

$sent = sendMail($selectedRoute['subject'], $htmlBody, $altBody, $email);

if (!$sent) {
    jsonResponse(500, [
        'ok' => false,
        'message' => publicMailErrorMessage(),
    ]);
}

jsonResponse(200, [
    'ok' => true,
    'message' => $selectedRoute['success_message'],
]);
