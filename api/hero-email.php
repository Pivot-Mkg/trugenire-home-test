<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'message' => 'Method not allowed.',
    ]);
    exit;
}

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
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'message' => 'Please enter a valid email address.',
    ]);
    exit;
}

$to = 'ttpll.marketing@truboardpartners.com, aakash@pivotmkg.com';
$from = 'website-enquiry@truboardpartners.com';
$subject = $selectedSource['subject'];
$submittedAtUtc = gmdate('Y-m-d H:i:s') . ' UTC';
$remoteIp = (string) ($_SERVER['REMOTE_ADDR'] ?? 'Unavailable');
$userAgent = (string) ($_SERVER['HTTP_USER_AGENT'] ?? 'Unavailable');

$bodyLines = [
    $selectedSource['summary'],
    '',
    'Submitted email: ' . $email,
    'Source: ' . $source,
    'Submitted at: ' . $submittedAtUtc,
    'IP address: ' . $remoteIp,
    'User agent: ' . $userAgent,
];

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: TruBoard Website Enquiry <' . $from . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(
    $to,
    $subject,
    implode("\r\n", $bodyLines),
    implode("\r\n", $headers)
);

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'We could not submit your email right now.',
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'message' => $selectedSource['success_message'],
]);
