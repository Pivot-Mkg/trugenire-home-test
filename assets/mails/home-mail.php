<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

require __DIR__ . '/mail-helper.php';

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
<body style="margin:0; padding:24px; background-color:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#10233f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px; border-collapse:collapse; background-color:#ffffff; border:1px solid #dbe4f0; border-radius:16px; overflow:hidden;">
                    <tr>
                        <td style="padding:32px 32px 20px; background:linear-gradient(135deg, #10233f 0%, #286fed 100%); color:#ffffff;">
                            <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; opacity:0.82;">TruBoard Technologies</div>
                            <h1 style="margin:12px 0 8px; font-size:28px; line-height:1.2; font-weight:700;">New Home Page Enquiry</h1>
                            <p style="margin:0; font-size:15px; line-height:1.6; color:#eaf1ff;">
                                Unified Real Estate. Asset Management &amp; Intelligence.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 32px 12px;">
                            <p style="margin:0 0 18px; font-size:15px; line-height:1.7; color:#42546d;">
                                A visitor used the home page capture form after viewing the TruBoard positioning around
                                execution, asset oversight, and real-time intelligence.
                            </p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate; border-spacing:0; background-color:#f7faff; border:1px solid #dbe4f0; border-radius:12px;">
                                <tr>
                                    <td style="padding:18px 20px; border-bottom:1px solid #dbe4f0;">
                                        <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:#6a7a90; margin-bottom:6px;">Submitted email</div>
                                        <div style="font-size:18px; line-height:1.5; font-weight:700; color:#10233f;">{$safeUserEmail}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:18px 20px;">
                                        <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:#6a7a90; margin-bottom:6px;">Submitted at</div>
                                        <div style="font-size:15px; line-height:1.6; color:#10233f;">{$safeSubmittedAt}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px 32px 32px;">
                            <p style="margin:0; font-size:14px; line-height:1.7; color:#42546d;">
                                Suggested follow-up: reach out with the most relevant TruBoard conversation, whether that is
                                services, TruGenie, or a broader asset management discussion.
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

function sendResponse(int $statusCode, string $message): never
{
    http_response_code($statusCode);
    echo json_encode([
        'status' => $statusCode,
        'message' => $message,
    ]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    sendResponse(405, 'Invalid request method. Only POST allowed.');
}

$userEmail = trim((string) ($_POST['userEmail'] ?? ''));

if ($userEmail === '' || filter_var($userEmail, FILTER_VALIDATE_EMAIL) === false) {
    sendResponse(400, 'Invalid email address.');
}

$safeUserEmail = htmlspecialchars($userEmail, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$submittedAt = date('d M Y, h:i A T');
$safeSubmittedAt = htmlspecialchars($submittedAt, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$sent = tb_send_html_mail(
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
    sendResponse(500, tb_public_mail_error_message());
}

sendResponse(200, 'Mail sent successfully!');
