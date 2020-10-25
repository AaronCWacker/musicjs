<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chord drills</title>
</head>
<body>
  <ul>
<?php
$g = glob("*.html");
foreach($g as $a) {
  echo "<li><a href='$a'>$a</a></li>\n";
}
?>
  </ul>
</body>
</html>