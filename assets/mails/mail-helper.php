<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=UTF-8');

function tb_json_response(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

function tb_ensure_post_request(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        tb_json_response(405, [
            'ok' => false,
            'message' => 'Method not allowed.',
        ]);
    }
}

function tb_mail_config(): array
{
    static $config = null;

    if ($config === null) {
        $config = require __DIR__ . '/mail-config.php';
    }

    return $config;
}

function tb_mail_recipients(): array
{
    return tb_mail_config()['recipients'] ?? [];
}

function tb_mail_from(): string
{
    $from = tb_mail_config()['from']['email'] ?? 'website-enquiry@truboardpartners.com';

    return trim((string) $from);
}

function tb_mail_from_name(): string
{
    $fromName = tb_mail_config()['from']['name'] ?? 'Website Enquiry';

    return trim((string) $fromName);
}

function tb_request_meta_lines(): array
{
    return [
        'Submitted at: ' . gmdate('Y-m-d H:i:s') . ' UTC',
        'IP address: ' . (string) ($_SERVER['REMOTE_ADDR'] ?? 'Unavailable'),
        'User agent: ' . (string) ($_SERVER['HTTP_USER_AGENT'] ?? 'Unavailable'),
    ];
}

function tb_clear_last_mail_error(): void
{
    $GLOBALS['tb_last_mail_error'] = '';
}

function tb_set_last_mail_error(string $message): void
{
    $GLOBALS['tb_last_mail_error'] = trim($message);
}

function tb_get_last_mail_error(): string
{
    $message = $GLOBALS['tb_last_mail_error'] ?? '';

    return is_string($message) ? trim($message) : '';
}

function tb_record_mail_error(PHPMailer $mail, Exception $exception): void
{
    $detail = trim((string) $mail->ErrorInfo);

    if ($detail === '') {
        $detail = trim($exception->getMessage());
    }

    tb_set_last_mail_error($detail);

    if ($detail !== '') {
        tb_log_mail_error_detail($detail);
    }
}

function tb_log_mail_error_detail(string $detail): void
{
    $script = basename((string) ($_SERVER['SCRIPT_NAME'] ?? 'mail-endpoint'));
    error_log('[TruBoard Mail][' . $script . '] ' . trim($detail));
}

function tb_public_mail_error_message(
    string $defaultMessage = 'Unable to send the email right now. Please try again later.'
): string {
    $detail = strtolower(tb_get_last_mail_error());

    if ($detail === '') {
        return $defaultMessage;
    }

    if (
        str_contains($detail, 'smtp connect() failed') ||
        str_contains($detail, 'failed to connect to server') ||
        str_contains($detail, 'connection refused') ||
        str_contains($detail, 'network is unreachable') ||
        str_contains($detail, 'timed out')
    ) {
        return 'SMTP connection to smtp.office365.com:587 failed on this server.';
    }

    if (
        str_contains($detail, '5.7.57') ||
        str_contains($detail, '5.7.139') ||
        str_contains($detail, 'client was not authenticated')
    ) {
        return 'Office365 rejected the authenticated send request. Confirm SMTP AUTH is enabled and this mailbox is allowed to send from website-enquiry@truboardpartners.com.';
    }

    if (
        str_contains($detail, 'authenticate') ||
        str_contains($detail, 'authentication') ||
        str_contains($detail, '535')
    ) {
        return 'SMTP authentication was rejected by Office365. Confirm the mailbox credentials and SMTP AUTH settings on this server.';
    }

    return $defaultMessage;
}

function tb_require_phpmailer_autoload(): void
{
    static $isLoaded = false;

    if ($isLoaded) {
        return;
    }

    if (class_exists(PHPMailer::class) && class_exists(Exception::class)) {
        $isLoaded = true;
        return;
    }

    $candidates = tb_mail_config()['autoload_candidates'] ?? [];

    foreach ($candidates as $candidate) {
        if (!is_string($candidate) || $candidate === '') {
            continue;
        }

        $resolvedCandidate = realpath($candidate);
        if ($resolvedCandidate === false || !is_file($resolvedCandidate)) {
            continue;
        }

        require_once $resolvedCandidate;

        if (class_exists(PHPMailer::class) && class_exists(Exception::class)) {
            $isLoaded = true;
            return;
        }
    }

    $sourceCandidates = [
        __DIR__ . '/vendor/phpmailer/phpmailer/src',
        dirname(__DIR__, 2) . '/vendor/phpmailer/phpmailer/src',
        dirname(__DIR__, 3) . '/vendor/phpmailer/phpmailer/src',
    ];

    foreach ($sourceCandidates as $sourceDir) {
        $resolvedSourceDir = realpath($sourceDir);
        if ($resolvedSourceDir === false || !is_dir($resolvedSourceDir)) {
            continue;
        }

        $requiredFiles = [
            $resolvedSourceDir . DIRECTORY_SEPARATOR . 'Exception.php',
            $resolvedSourceDir . DIRECTORY_SEPARATOR . 'PHPMailer.php',
            $resolvedSourceDir . DIRECTORY_SEPARATOR . 'SMTP.php',
        ];

        $allFilesExist = true;
        foreach ($requiredFiles as $requiredFile) {
            if (!is_file($requiredFile)) {
                $allFilesExist = false;
                break;
            }
        }

        if (!$allFilesExist) {
            continue;
        }

        foreach ($requiredFiles as $requiredFile) {
            require_once $requiredFile;
        }

        if (class_exists(PHPMailer::class) && class_exists(Exception::class)) {
            $isLoaded = true;
            return;
        }
    }

    tb_json_response(500, [
        'ok' => false,
        'message' => 'PHPMailer dependency is missing on this server. Deploy assets/mails/vendor or run composer install in assets/mails.',
    ]);
}

function tb_assert_mail_configuration(array $smtp): void
{
    $host = trim((string) ($smtp['host'] ?? ''));
    $username = trim((string) ($smtp['username'] ?? ''));
    $password = trim((string) ($smtp['password'] ?? ''));
    $fromEmail = tb_mail_from();
    $hasRecipient = false;

    foreach (tb_mail_recipients() as $recipient) {
        $email = trim((string) ($recipient['email'] ?? ''));
        if ($email !== '') {
            $hasRecipient = true;
            break;
        }
    }

    if ($host === '' || $username === '' || $password === '' || $fromEmail === '' || !$hasRecipient) {
        tb_json_response(500, [
            'ok' => false,
            'message' => 'Mail service is not fully configured on this server.',
        ]);
    }
}

function tb_configure_mailer(?string $replyTo = null): PHPMailer
{
    tb_require_phpmailer_autoload();

    $config = tb_mail_config();
    $smtp = $config['smtp'] ?? [];
    tb_assert_mail_configuration($smtp);
    $smtpSecure = trim((string) ($smtp['secure'] ?? 'starttls'));
    $replyToAddress = trim((string) $replyTo);

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->CharSet = 'UTF-8';
    $mail->Host = trim((string) ($smtp['host'] ?? ''));
    $mail->SMTPAuth = (bool) ($smtp['auth'] ?? true);
    $mail->Username = trim((string) ($smtp['username'] ?? ''));
    $mail->Password = trim((string) ($smtp['password'] ?? ''));
    $mail->Port = (int) ($smtp['port'] ?? 587);
    $mail->Timeout = 20;
    $mail->SMTPSecure = ($smtpSecure === 'starttls')
        ? PHPMailer::ENCRYPTION_STARTTLS
        : $smtpSecure;

    $mail->setFrom(tb_mail_from(), tb_mail_from_name());

    $recipientCount = 0;
    foreach (tb_mail_recipients() as $recipient) {
        $email = trim((string) ($recipient['email'] ?? ''));
        $name = trim((string) ($recipient['name'] ?? ''));

        if ($email === '') {
            continue;
        }

        $mail->addAddress($email, $name);
        $recipientCount++;
    }

    if ($recipientCount === 0) {
        tb_json_response(500, [
            'ok' => false,
            'message' => 'Mail service recipient list is empty on this server.',
        ]);
    }

    if ($replyToAddress !== '' && filter_var($replyToAddress, FILTER_VALIDATE_EMAIL) !== false) {
        $mail->addReplyTo($replyToAddress);
    }

    return $mail;
}

function tb_send_plain_mail(string $subject, array $bodyLines, ?string $replyTo = null): bool
{
    tb_clear_last_mail_error();

    try {
        $mail = tb_configure_mailer($replyTo);
        $body = implode("\r\n", $bodyLines);

        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = $body;

        return $mail->send();
    } catch (Exception $exception) {
        if (isset($mail) && $mail instanceof PHPMailer) {
            tb_record_mail_error($mail, $exception);
        } else {
            tb_set_last_mail_error($exception->getMessage());
            tb_log_mail_error_detail($exception->getMessage());
        }
        return false;
    }
}

function tb_safe_attachment_name(string $fileName): string
{
    $safeName = preg_replace('/[^A-Za-z0-9._-]+/', '-', basename($fileName)) ?? '';
    $safeName = trim($safeName, '.- ');

    return $safeName !== '' ? $safeName : 'attachment.pdf';
}

function tb_send_mail_with_attachment(
    string $subject,
    array $bodyLines,
    ?string $replyTo = null,
    ?array $attachment = null
): bool {
    tb_clear_last_mail_error();

    try {
        $mail = tb_configure_mailer($replyTo);
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
                tb_safe_attachment_name((string) $attachment['name']),
                'base64',
                (string) ($attachment['mime_type'] ?? 'application/octet-stream')
            );
        }

        return $mail->send();
    } catch (Exception $exception) {
        if (isset($mail) && $mail instanceof PHPMailer) {
            tb_record_mail_error($mail, $exception);
        } else {
            tb_set_last_mail_error($exception->getMessage());
            tb_log_mail_error_detail($exception->getMessage());
        }
        return false;
    }
}

function tb_send_html_mail(
    string $subject,
    string $htmlBody,
    string $altBody,
    ?string $replyTo = null
): bool {
    tb_clear_last_mail_error();

    try {
        $mail = tb_configure_mailer($replyTo);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = $altBody;

        return $mail->send();
    } catch (Exception $exception) {
        if (isset($mail) && $mail instanceof PHPMailer) {
            tb_record_mail_error($mail, $exception);
        } else {
            tb_set_last_mail_error($exception->getMessage());
            tb_log_mail_error_detail($exception->getMessage());
        }
        return false;
    }
}
