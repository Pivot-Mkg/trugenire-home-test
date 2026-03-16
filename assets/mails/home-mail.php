<?php
declare(strict_types=1);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    header('Content-Type: application/javascript; charset=UTF-8');

    echo <<<'JS'
(function () {
    var forms = document.querySelectorAll('.js-email-capture-form');
    var toastContainer = document.getElementById('toastContainer');
    var endpoint = './assets/mails/home-mail.php';

    if (!forms.length) {
        return;
    }

    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            submitEmailCapture(form);
        });
    });

    async function submitEmailCapture(form) {
        var input = form.querySelector('.js-email-capture-input');
        var submitButton = form.querySelector('button[type="submit"]');
        var formData = new FormData();
        var response;
        var payload;

        if (!input || !submitButton) {
            return;
        }

        input.value = input.value.trim();

        if (!input.checkValidity()) {
            input.reportValidity();
            return;
        }

        if (!submitButton.dataset.originalText) {
            submitButton.dataset.originalText = submitButton.textContent.trim();
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        formData.append('userEmail', input.value);

        try {
            response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            payload = await response.json();

            if (response.ok && payload.status === 200) {
                form.reset();
                showToast(payload.message, 'success');
                return;
            }

            showToast(payload.message || 'Unable to submit your email right now.', 'error');
        } catch (error) {
            showToast('Unable to submit your email right now.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = submitButton.dataset.originalText;
        }
    }

    function showToast(message, type) {
        var toast = document.createElement('div');
        var host = toastContainer || document.body;

        if (toastContainer) {
            toastContainer.innerHTML = '';
        }

        toast.className = 'toast-message ' + type;
        toast.textContent = message;
        toast.style.display = 'block';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        host.appendChild(toast);

        requestAnimationFrame(function () {
            toast.style.opacity = '0.95';
        });

        window.setTimeout(function () {
            toast.style.opacity = '0';
            window.setTimeout(function () {
                toast.remove();
            }, 400);
        }, 3000);
    }
}());
JS;
    exit;
}

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
