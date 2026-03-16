<?php
declare(strict_types=1);

$secrets = require __DIR__ . '/mail-secrets.php';

return [
    'autoload_candidates' => [
        __DIR__ . '/vendor/autoload.php',
        dirname(__DIR__, 2) . '/vendor/autoload.php',
    ],
    'smtp' => [
        'host' => 'smtp.office365.com',
        'auth' => true,
        'port' => 587,
        'secure' => 'starttls',
        'username' => (string) ($secrets['username'] ?? ''),
        'password' => (string) ($secrets['password'] ?? ''),
    ],
    'from' => [
        'email' => 'website-enquiry@truboardpartners.com',
        'name' => 'Website Enquiry',
    ],
    'recipients' => [
        // Production recipient:
        // ['email' => 'tcpl.marketing@truboardpartners.com', 'name' => 'TCPL Marketing'],

        // Testing recipient only:
        ['email' => 'aakash@pivotmkg.com', 'name' => 'Aakash'],
    ],
];
