<?php
header('Content-Type: application/json');

$messages = file('messages.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
echo json_encode($messages);
?>
