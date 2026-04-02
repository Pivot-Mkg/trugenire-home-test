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
    // ['email' => 'marketing@trugenie.com', 'name' => 'TruGenie Marketing'],
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
            'status' => 405,
            'message' => 'Invalid request method. Only POST allowed.',
        ]);
    }
}

function logMailError(string $detail): void
{
    $message = trim($detail);
    if ($message === '') {
        return;
    }
    error_log('[TruBoard Mail][home-mail.php] ' . $message);
}

function publicMailErrorMessage(): string
{
    return 'Technical error. Please try again later.';
}

function setLastMailError(string $detail): void
{
    $GLOBALS['LAST_MAIL_ERROR'] = trim($detail);
}

function getLastMailError(): string
{
    $value = $GLOBALS['LAST_MAIL_ERROR'] ?? '';
    return is_string($value) ? trim($value) : '';
}

function requireMailerAutoload(): void
{
    $autoload = __DIR__ . '/vendor/autoload.php';
    if (!is_file($autoload)) {
        logMailError('PHPMailer dependency is missing. Deploy assets/mails/vendor or run composer install in assets/mails.');
        jsonResponse(500, [
            'status' => 500,
            'message' => publicMailErrorMessage(),
        ]);
    }
    require_once $autoload;
}

function configureMailer(?string $replyTo = null): PHPMailer
{
    requireMailerAutoload();

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

    if ($GLOBALS['SMTP_USERNAME'] === '' || $GLOBALS['SMTP_PASSWORD'] === '' || $GLOBALS['FROM_EMAIL'] === '') {
        logMailError('Mail service is not fully configured on this server.');
        jsonResponse(500, [
            'status' => 500,
            'message' => publicMailErrorMessage(),
        ]);
    }

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
            'status' => 500,
            'message' => publicMailErrorMessage(),
        ]);
    }

    if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($replyTo);
    }

    return $mail;
}

function sendHtmlMail(string $subject, string $htmlBody, string $altBody, ?string $replyTo = null): bool
{
    setLastMailError('');

    try {
        $mail = configureMailer($replyTo);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = $altBody;
        return $mail->send();
    } catch (Exception $exception) {
        $detail = isset($mail) && $mail instanceof PHPMailer ? $mail->ErrorInfo : $exception->getMessage();
        setLastMailError($detail);
        logMailError($detail);
        return false;
    }
}

function buildHomeCaptureEmailTemplate(string $safeUserEmail, string $safeSubmittedAt): string
{
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Home Page Enquiry</title>
</head>
<body style="margin:0; padding:24px; background:#f5f7fb; font-family:Arial, Helvetica, sans-serif; color:#10233f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px; border-collapse:collapse; background:#ffffff; border:1px solid #dbe4f0; border-radius:14px; overflow:hidden;">
                    <tr>
                        <td style="padding:24px 28px; background:#10233f; color:#ffffff;">
                            <p style="margin:0; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.85;">TruBoard Technologies</p>
                            <h1 style="margin:10px 0 0; font-size:24px; line-height:1.25; font-weight:700;">New Home Page Enquiry</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 28px;">
                            <p style="margin:0 0 14px; font-size:15px; line-height:1.6; color:#42546d;">
                                A visitor submitted the home page contact form.
                            </p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse; background:#f7faff; border:1px solid #dbe4f0; border-radius:10px;">
                                <tr>
                                    <td style="padding:14px 16px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90; width:160px;">Submitted Email</td>
                                    <td style="padding:14px 16px; border-bottom:1px solid #dbe4f0; font-size:16px; font-weight:700; color:#10233f;">{$safeUserEmail}</td>
                                </tr>
                                <tr>
                                    <td style="padding:14px 16px; font-size:13px; color:#6a7a90;">Submitted At</td>
                                    <td style="padding:14px 16px; font-size:14px; color:#10233f;">{$safeSubmittedAt}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 28px 24px;">
                            <p style="margin:0; font-size:13px; line-height:1.6; color:#6a7a90;">
                                Follow up with the user on the relevant TruBoard service or product discussion.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
}

ensurePostRequest();

$userEmail = trim((string) ($_POST['userEmail'] ?? ''));

if ($userEmail === '' || filter_var($userEmail, FILTER_VALIDATE_EMAIL) === false) {
    jsonResponse(400, [
        'status' => 400,
        'message' => 'Invalid email address.',
    ]);
}

$safeUserEmail = htmlspecialchars($userEmail, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$submittedAt = date('d M Y, h:i A T');
$safeSubmittedAt = htmlspecialchars($submittedAt, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$sent = sendHtmlMail(
    'New Home Page Enquiry | Asset Management & Intelligence',
    buildHomeCaptureEmailTemplate($safeUserEmail, $safeSubmittedAt),
    "New home page enquiry\n"
        . "Unified Real Estate | Asset Management & Intelligence\n\n"
        . "Submitted email: {$userEmail}\n"
        . "Submitted at: {$submittedAt}\n\n"
        . "Suggested follow-up: reach out with the most relevant TruBoard conversation for this lead.",
    $userEmail
);

if (!$sent) {
    $debugDetail = getLastMailError();
    jsonResponse(500, [
        'status' => 500,
        'message' => publicMailErrorMessage(),
        'debug' => $debugDetail !== '' ? $debugDetail : 'Unknown home-mail.php failure',
    ]);
}

jsonResponse(200, [
    'status' => 200,
    'message' => 'Mail sent successfully!',
]);
