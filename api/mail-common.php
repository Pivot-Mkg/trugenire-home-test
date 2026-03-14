<?php
declare(strict_types=1);

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

function tb_mail_recipients(): string
{
    return 'ttpll.marketing@truboardpartners.com, aakash@pivotmkg.com';
}

function tb_mail_from(): string
{
    return 'website-enquiry@truboardpartners.com';
}

function tb_request_meta_lines(): array
{
    return [
        'Submitted at: ' . gmdate('Y-m-d H:i:s') . ' UTC',
        'IP address: ' . (string) ($_SERVER['REMOTE_ADDR'] ?? 'Unavailable'),
        'User agent: ' . (string) ($_SERVER['HTTP_USER_AGENT'] ?? 'Unavailable'),
    ];
}

function tb_mail_headers(array $extraHeaders = [], ?string $replyTo = null): string
{
    $headers = [
        'MIME-Version: 1.0',
        'From: TruBoard Website Enquiry <' . tb_mail_from() . '>',
        'X-Mailer: PHP/' . phpversion(),
    ];

    if ($replyTo !== null && $replyTo !== '') {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    return implode("\r\n", array_merge($headers, $extraHeaders));
}

function tb_send_plain_mail(string $subject, array $bodyLines, ?string $replyTo = null): bool
{
    return mail(
        tb_mail_recipients(),
        $subject,
        implode("\r\n", $bodyLines),
        tb_mail_headers([
            'Content-Type: text/plain; charset=UTF-8',
        ], $replyTo)
    );
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
    if (
        $attachment === null ||
        empty($attachment['content']) ||
        empty($attachment['name'])
    ) {
        return tb_send_plain_mail($subject, $bodyLines, $replyTo);
    }

    $boundary = 'tb-' . md5(uniqid((string) mt_rand(), true));
    $attachmentName = tb_safe_attachment_name((string) $attachment['name']);
    $attachmentMime = (string) ($attachment['mime_type'] ?? 'application/octet-stream');

    $body = [
        '--' . $boundary,
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        implode("\r\n", $bodyLines),
        '',
        '--' . $boundary,
        'Content-Type: ' . $attachmentMime . '; name="' . $attachmentName . '"',
        'Content-Transfer-Encoding: base64',
        'Content-Disposition: attachment; filename="' . $attachmentName . '"',
        '',
        chunk_split(base64_encode((string) $attachment['content'])),
        '--' . $boundary . '--',
    ];

    return mail(
        tb_mail_recipients(),
        $subject,
        implode("\r\n", $body),
        tb_mail_headers([
            'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
        ], $replyTo)
    );
}
