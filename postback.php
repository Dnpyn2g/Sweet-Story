<?php
// Получение параметров из запроса
$cid = isset($_GET['cid']) ? $_GET['cid'] : 'unknown';
$payout = isset($_GET['payout']) ? $_GET['payout'] : 0;
$source = isset($_GET['source']) ? $_GET['source'] : 'unknown';
$geo = isset($_GET['geo']) ? $_GET['geo'] : 'unknown';

// Логирование данных (можно заменить на запись в базу данных)
file_put_contents('postback_log.txt', date('Y-m-d H:i:s') . " | CID: $cid | Payout: $payout | Source: $source | Geo: $geo" . PHP_EOL, FILE_APPEND);

// Ответ партнерской сети
http_response_code(200);
echo "Postback received successfully.";
?>
