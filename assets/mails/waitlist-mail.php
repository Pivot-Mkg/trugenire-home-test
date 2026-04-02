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
    error_log('[TruBoard Mail][waitlist-mail.php] ' . $message);
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

function sendPlainMail(string $subject, array $bodyLines, ?string $replyTo = null): bool
{
    try {
        $mail = configureMailer($replyTo);
        $body = implode("\r\n", $bodyLines);
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = $body;
        return $mail->send();
    } catch (Exception $exception) {
        $detail = isset($mail) && $mail instanceof PHPMailer ? $mail->ErrorInfo : $exception->getMessage();
        logMailError($detail);
        return false;
    }
}

ensurePostRequest();

$email = trim((string) ($_POST['email'] ?? ''));
$source = trim((string) ($_POST['source'] ?? 'home-hero'));

$sourceConfig = [
    'home-hero' => [
        'subject' => 'New website hero email enquiry',
        'summary' => 'A new email enquiry was submitted from the website hero section.',
        'success_message' => 'Thanks. Your email has been submitted.',
    ],
    'construction-ai-waitlist' => [
        'subject' => 'New Construction AI waitlist submission',
        'summary' => 'A new waitlist email was submitted from the Construction AI page.',
        'success_message' => 'Thanks. You have been added to the Construction AI waitlist.',
    ],
    'property-ai-waitlist' => [
        'subject' => 'New Property AI waitlist submission',
        'summary' => 'A new waitlist email was submitted from the Property AI page.',
        'success_message' => 'Thanks. You have been added to the Property AI waitlist.',
    ],
];

$selectedSource = $sourceConfig[$source] ?? [
    'subject' => 'New website email enquiry',
    'summary' => 'A new email enquiry was submitted from the website.',
    'success_message' => 'Thanks. Your email has been submitted.',
];

if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    jsonResponse(422, [
        'ok' => false,
        'message' => 'Please enter a valid email address.',
    ]);
}

$subject = $selectedSource['subject'];

$bodyLines = [
    $selectedSource['summary'],
    '',
    'Submitted email: ' . $email,
    'Source: ' . $source,
];
$bodyLines = array_merge($bodyLines, requestMetaLines());

$sent = sendPlainMail($subject, $bodyLines, $email);

if (!$sent) {
    jsonResponse(500, [
        'ok' => false,
        'message' => publicMailErrorMessage(),
    ]);
}

jsonResponse(200, [
    'ok' => true,
    'message' => $selectedSource['success_message'],
]);
