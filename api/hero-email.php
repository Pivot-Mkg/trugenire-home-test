<?php
declare(strict_types=1);

require __DIR__ . '/mail-common.php';

tb_ensure_post_request();

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
    tb_json_response(422, [
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
$bodyLines = array_merge($bodyLines, tb_request_meta_lines());

$sent = tb_send_plain_mail($subject, $bodyLines, $email);

if (!$sent) {
    tb_json_response(500, [
        'ok' => false,
        'message' => 'We could not submit your email right now.',
    ]);
}

tb_json_response(200, [
    'ok' => true,
    'message' => $selectedSource['success_message'],
]);
