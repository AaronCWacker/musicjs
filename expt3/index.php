<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chord drills</title>
</head>
<body>
<h1>Random music practice drills</h1>
<p>Here are a few things I wrote for piano practice. Basically it takes a simple pattern and gives you random notes within that pattern. The intent is to aid composition and improvisation by giving you patterns to practice to, covering possibilities you'd otherwise miss.</p>
<p>It uses a random number generator that takes seed values (<a href='https://github.com/DomenicoDeFelice/jsrand'>from here</a>) and the controls at the top control the seed. The Daily button takes the number of days from 1/1/2020, multiplied by 100 to generate a seed. The +1/-1 etc. buttons select different seeds. These are mapped to X,C,V,B,N,M. Z is mapped to Zero. S toggles sharps/flats. The point of the seed is that this can reproduce exactly a pattern you've seen before, all you need to remember is the seed.</p>
<ul>
<?php
$g = glob("*.html");
foreach($g as $a) {
  $handle = fopen($a,"r");
  $title = null;
  while(($line = fgets($handle)) !== false) {
    if(preg_match("@<title>(.*)</title>@",$line,$m)) {
      $title = $m[1];
      break;
    }
  }
  fclose($handle);
  echo "<li><a href='$a'>$a</a>".($title?" - $title":"")."</li>\n";
}
?>
</ul>
</body>
</html>
