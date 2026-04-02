<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=UTF-8');

$SMTP_HOST = 'smtp.office365.com';
$SMTP_PORT = 587;
$SMTP_SECURE = PHPMailer::ENCRYPTION_STARTTLS;
$SMTP_USERNAME = 'website-enquiry@truboardpartners.com';
$SMTP_PASSWORD = 'hzhkdwmqskxjhysc';
$FROM_EMAIL = 'website-enquiry@truboardpartners.com';
$FROM_NAME = 'Website Enquiry';
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
        'IP address: ' . (string) ($_SERVER['REMOTE_ADDR'] ?? 'Unavailable'),
        'User agent: ' . (string) ($_SERVER['HTTP_USER_AGENT'] ?? 'Unavailable'),
    ];
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
    $mail->SMTPSecure = $GLOBALS['SMTP_SECURE'];
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
    array $bodyLines,
    ?string $replyTo = null,
    ?array $attachment = null
): bool {
    try {
        $mail = configureMailer($replyTo);
        $body = implode("\r\n", $bodyLines);
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = $body;

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

if ($firstName === '') {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter the first name.',
    ]);
}

if ($lastName === '') {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter the last name.',
    ]);
}

if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter a valid work email.',
    ]);
}

if ($roleInterest === '') {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please select a role area.',
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

$bodyLines = array_merge($bodyLines, requestMetaLines());

$sent = sendMailWithAttachment(
    'New careers profile submission',
    $bodyLines,
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
