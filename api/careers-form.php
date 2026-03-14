<?php
declare(strict_types=1);

require __DIR__ . '/mail-common.php';

tb_ensure_post_request();

$firstName = trim((string) ($_POST['first_name'] ?? ''));
$lastName = trim((string) ($_POST['last_name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$roleInterest = trim((string) ($_POST['role_interest'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($firstName === '') {
    tb_json_response(422, [
        'ok' => false,
        'message' => 'Please enter the first name.',
    ]);
}

if ($lastName === '') {
    tb_json_response(422, [
        'ok' => false,
        'message' => 'Please enter the last name.',
    ]);
}

if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    tb_json_response(422, [
        'ok' => false,
        'message' => 'Please enter a valid work email.',
    ]);
}

if ($roleInterest === '') {
    tb_json_response(422, [
        'ok' => false,
        'message' => 'Please select a role area.',
    ]);
}

$attachment = null;
$resume = $_FILES['resume'] ?? null;

if (is_array($resume)) {
    $resumeError = (int) ($resume['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($resumeError !== UPLOAD_ERR_NO_FILE && $resumeError !== UPLOAD_ERR_OK) {
        tb_json_response(422, [
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
            tb_json_response(422, [
                'ok' => false,
                'message' => 'Resume must be 2MB or smaller.',
            ]);
        }

        if ($resumeTmpName === '' || !is_uploaded_file($resumeTmpName)) {
            tb_json_response(422, [
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
            tb_json_response(422, [
                'ok' => false,
                'message' => 'Please upload a PDF resume.',
            ]);
        }

        $resumeContent = file_get_contents($resumeTmpName);
        if ($resumeContent === false) {
            tb_json_response(422, [
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

$bodyLines = array_merge($bodyLines, tb_request_meta_lines());

$sent = tb_send_mail_with_attachment(
    'New careers profile submission',
    $bodyLines,
    $email,
    $attachment
);

if (!$sent) {
    tb_json_response(500, [
        'ok' => false,
        'message' => 'We could not submit the profile right now.',
    ]);
}

tb_json_response(200, [
    'ok' => true,
    'message' => 'Thanks. Your profile has been submitted.',
]);
