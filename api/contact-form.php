<?php
declare(strict_types=1);

require __DIR__ . '/mail-common.php';

tb_ensure_post_request();

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

if ($name === '') {
    tb_json_response(422, [
        'ok' => false,
        'message' => 'Please enter your name.',
    ]);
}

if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    tb_json_response(422, [
        'ok' => false,
        'message' => 'Please enter a valid email address.',
    ]);
}

if ($message === '') {
    tb_json_response(422, [
        'ok' => false,
        'message' => 'Please enter your requirement details.',
    ]);
}

if ($inquiryType === '') {
    $inquiryType = 'Website Inquiry';
}

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

$bodyLines = array_merge($bodyLines, tb_request_meta_lines());

$sent = tb_send_plain_mail($selectedRoute['subject'], $bodyLines, $email);

if (!$sent) {
    tb_json_response(500, [
        'ok' => false,
        'message' => 'We could not submit your request right now.',
    ]);
}

tb_json_response(200, [
    'ok' => true,
    'message' => $selectedRoute['success_message'],
]);
