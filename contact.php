<?php
// Contact form handler: emails website enquiries to the SafeCode inbox.
// Uses PHP mail(), which on HostGator sends through the account's own mail
// server (mail.safecodeg.com) — no mailbox password is stored here.

const TO_ADDRESS   = 'contact@safecodeg.com';
const FROM_ADDRESS = 'contact@safecodeg.com';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond($code, $payload) {
  http_response_code($code);
  echo json_encode($payload);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Honeypot: real visitors never see or fill this field.
if (!empty($_POST['website'])) {
  respond(200, ['ok' => true]);
}

// Single-line fields: strip CR/LF so they cannot inject mail headers.
function field($name, $max) {
  $v = isset($_POST[$name]) ? trim((string) $_POST[$name]) : '';
  $v = str_replace(["\r", "\n"], ' ', $v);
  return mb_substr($v, 0, $max);
}

$first   = field('first', 100);
$last    = field('last', 100);
$email   = field('email', 200);
$company = field('company', 200);
$service = field('service', 100);
$message = isset($_POST['message']) ? mb_substr(trim((string) $_POST['message']), 0, 5000) : '';

if ($first === '' || $last === '' || $service === '' || mb_strlen($message) <= 5
    || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond(400, ['ok' => false, 'error' => 'Please fill in all required fields correctly.']);
}

$subject = 'Website enquiry: ' . $service . ' — ' . $first . ' ' . $last;
$body = "New enquiry from the safecodeg.com contact form\n\n"
      . "Name:    $first $last\n"
      . "Email:   $email\n"
      . "Company: " . ($company !== '' ? $company : '-') . "\n"
      . "Service: $service\n"
      . "Sent:    " . gmdate('Y-m-d H:i') . " UTC\n\n"
      . "Message:\n$message\n";

$headers = [
  'From: SafeCode Website <' . FROM_ADDRESS . '>',
  'Reply-To: ' . $email,
  'Content-Type: text/plain; charset=UTF-8',
  'X-Mailer: safecodeg.com contact form',
];

$sent = mail(TO_ADDRESS, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body,
             implode("\r\n", $headers), '-f' . FROM_ADDRESS);

if (!$sent) {
  respond(500, ['ok' => false, 'error' => 'Could not send your enquiry. Please email ' . TO_ADDRESS . ' directly.']);
}
respond(200, ['ok' => true]);
