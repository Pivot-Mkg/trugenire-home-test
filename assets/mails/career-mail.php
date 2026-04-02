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
    // ['email' => 'talenthr.re@truboardpartners.com', 'name' => 'Talent HR'],
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
    error_log('[TruBoard Mail][career-mail.php] ' . $message);
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

function safeAttachmentName(string $fileName): string
{
    $safeName = preg_replace('/[^A-Za-z0-9._-]+/', '-', basename($fileName)) ?? '';
    $safeName = trim($safeName, '.- ');
    return $safeName !== '' ? $safeName : 'attachment.pdf';
}

function sendMailWithAttachment(
    string $subject,
    string $htmlBody,
    string $altBody,
    ?string $replyTo = null,
    ?array $attachment = null
): bool {
    try {
        $mail = configureMailer($replyTo);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = $altBody;

        if (
            $attachment !== null &&
            !empty($attachment['content']) &&
            !empty($attachment['name'])
        ) {
            $mail->addStringAttachment(
                (string) $attachment['content'],
                safeAttachmentName((string) $attachment['name']),
                'base64',
                (string) ($attachment['mime_type'] ?? 'application/octet-stream')
            );
        }

        return $mail->send();
    } catch (Exception $exception) {
        $detail = isset($mail) && $mail instanceof PHPMailer ? $mail->ErrorInfo : $exception->getMessage();
        logMailError($detail);
        return false;
    }
}

ensurePostRequest();

$firstName = trim((string) ($_POST['first_name'] ?? ''));
$lastName = trim((string) ($_POST['last_name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$roleInterest = trim((string) ($_POST['role_interest'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

$firstName = trim((string) preg_replace('/\s+/u', ' ', $firstName));
$lastName = trim((string) preg_replace('/\s+/u', ' ', $lastName));
$roleInterest = trim((string) preg_replace('/\s+/u', ' ', $roleInterest));
$message = trim($message);

if (!hasVisibleText($firstName)) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter the first name.',
    ]);
}

if (!hasVisibleText($lastName)) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter the last name.',
    ]);
}

if (strlen($firstName) > 80) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'First name must be 80 characters or fewer.',
    ]);
}

if (strlen($lastName) > 80) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Last name must be 80 characters or fewer.',
    ]);
}

if ($email === '' || strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter a valid work email.',
    ]);
}

if (!hasVisibleText($roleInterest)) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please select a role area.',
    ]);
}

if (strlen($roleInterest) > 80) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Role area must be 80 characters or fewer.',
    ]);
}

if ($message !== '' && !hasVisibleText($message)) {
    $message = '';
}

if (strlen($message) > 3000) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Background summary must be 3000 characters or fewer.',
    ]);
}

$attachment = null;
$resume = $_FILES['resume'] ?? null;

if (is_array($resume)) {
    $resumeError = (int) ($resume['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($resumeError !== UPLOAD_ERR_NO_FILE && $resumeError !== UPLOAD_ERR_OK) {
        jsonResponse(422, [
            'ok' => false,
            'message' => 'We could not read the uploaded resume. Please try again.',
        ]);
    }

    if ($resumeError === UPLOAD_ERR_OK) {
        $resumeName = (string) ($resume['name'] ?? 'resume.pdf');
        $resumeTmpName = (string) ($resume['tmp_name'] ?? '');
        $resumeSize = (int) ($resume['size'] ?? 0);
        $resumeMimeType = '';

        if ($resumeSize > 2 * 1024 * 1024) {
            jsonResponse(422, [
                'ok' => false,
                'message' => 'Resume must be 2MB or smaller.',
            ]);
        }

        if ($resumeTmpName === '' || !is_uploaded_file($resumeTmpName)) {
            jsonResponse(422, [
                'ok' => false,
                'message' => 'We could not verify the uploaded resume.',
            ]);
        }

        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo !== false) {
                $detectedMimeType = finfo_file($finfo, $resumeTmpName);
                if (is_string($detectedMimeType)) {
                    $resumeMimeType = $detectedMimeType;
                }
                finfo_close($finfo);
            }
        }

        $normalizedName = strtolower($resumeName);
        $isPdfByExtension = substr($normalizedName, -4) === '.pdf';
        $allowedMimeTypes = [
            'application/pdf',
            'application/x-pdf',
        ];
        $isPdfByMime = in_array($resumeMimeType, $allowedMimeTypes, true);

        if (!$isPdfByExtension && !$isPdfByMime) {
            jsonResponse(422, [
                'ok' => false,
                'message' => 'Please upload a PDF resume.',
            ]);
        }

        $resumeContent = file_get_contents($resumeTmpName);
        if ($resumeContent === false) {
            jsonResponse(422, [
                'ok' => false,
                'message' => 'We could not read the uploaded resume.',
            ]);
        }

        $attachment = [
            'name' => $resumeName,
            'mime_type' => 'application/pdf',
            'content' => $resumeContent,
        ];
    }
}

$bodyLines = [
    'A new Careers profile was submitted from the website.',
    '',
    'First name: ' . $firstName,
    'Last name: ' . $lastName,
    'Email: ' . $email,
    'Role area: ' . $roleInterest,
    'Resume attached: ' . ($attachment !== null ? 'Yes' : 'No'),
    '',
    'Background summary:',
    $message !== '' ? $message : 'Not provided.',
    '',
];

$metaLines = requestMetaLines();
$bodyLines = array_merge($bodyLines, $metaLines);
$altBody = implode("\r\n", $bodyLines);

$safeFirstName = safeHtml($firstName);
$safeLastName = safeHtml($lastName);
$safeEmail = safeHtml($email);
$safeRoleInterest = safeHtml($roleInterest);
$safeResumeAttached = safeHtml($attachment !== null ? 'Yes' : 'No');
$safeBackground = nl2br(safeHtml($message !== '' ? $message : 'Not provided.'), false);
$safeSubmittedAt = safeHtml($metaLines[0] ?? 'Submitted at: Unavailable');

$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Careers Profile</title>
</head>
<body style="margin:0; padding:24px; background:#f5f7fb; font-family:Arial, Helvetica, sans-serif; color:#10233f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px; border-collapse:collapse; background:#ffffff; border:1px solid #dbe4f0; border-radius:14px; overflow:hidden;">
                    <tr>
                        <td style="padding:20px 24px; background:#10233f; color:#ffffff;">
                            <p style="margin:0; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; opacity:0.85;">TruBoard Technologies</p>
                            <h1 style="margin:8px 0 0; font-size:22px; line-height:1.3; font-weight:700;">New Careers Profile</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 24px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse; background:#f7faff; border:1px solid #dbe4f0; border-radius:10px;">
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90; width:180px;">First Name</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeFirstName}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Last Name</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeLastName}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Email</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeEmail}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Role Area</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeRoleInterest}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Resume Attached</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:15px; color:#10233f;">{$safeResumeAttached}</td></tr>
                                <tr><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:13px; color:#6a7a90;">Submitted At</td><td style="padding:12px 14px; border-bottom:1px solid #dbe4f0; font-size:14px; color:#10233f;">{$safeSubmittedAt}</td></tr>
                            </table>
                            <h2 style="margin:18px 0 8px; font-size:15px; color:#10233f;">Background Summary</h2>
                            <p style="margin:0; font-size:14px; line-height:1.6; color:#344764;">{$safeBackground}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

$sent = sendMailWithAttachment(
    'New careers profile submission',
    $htmlBody,
    $altBody,
    $email,
    $attachment
);

if (!$sent) {
    jsonResponse(500, [
        'ok' => false,
        'message' => publicMailErrorMessage(),
    ]);
}

jsonResponse(200, [
    'ok' => true,
    'message' => 'Thanks for sharing your profile. Our team will review it and reach out if there is a fit.',
]);
