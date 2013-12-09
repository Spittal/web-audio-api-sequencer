<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="author" href="humans.txt" />
    <link rel="stylesheet" href="includes/css/app.css" />
    <script src="bower_components/modernizr/modernizr.js"></script>
  </head>
  <body>
    <!--[if lt IE 7]>
        <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <section class="lights"></section>

    <section class="sidebar">
      <h3>Sequencer</h3>
      <h6>A <a href="http://randomshapes.ca">Random Shapes</a> Experiment</h6>
      <label for="cutoff">Filter</label>
      <input type="range" name="cutoff" id="cutoff" min="0" max="1" step="0.01" value="1"></input>
      <label for="tempo">Tempo</label>
      <input type="range" name="tempo" id="tempo" min="20" max="600" value="320"></input>
      <label for="volume">Volume</label>
      <input type="range" name="volume" id="volume" min="0" max="1" step="0.01" value="0.8"></input>
      <label for="reverb">Reverb</label>
      <input type="range" name="reverb" id="reverb" min="0" max="1" step="0.01" value="0.5"></input>
      <div id="oct-title" class="titlelab">Octave:0</div>
      <ul class="octave-but button-group">
        <li><a id="oct-down" href="#" class="small button">-</a></li>
        <li><a id="oct-up" href="#" class="small button">+</a></li>
      </ul>
      <div id="tempo-title" class="titlelab">Delay Time</div>
      <ul class="tempo-but button-group">
        <li><a id="tempo-half" href="#" class="small button">1/2</a></li>
        <li><a id="tempo-whole" href="#" class="small button">1</a></li>
        <li><a id="tempo-double" href="#" class="small button">2</a></li>
      </ul>
      <div class="clear">Clear</div>
    </section>

    <section id="lights-2" class="lights"></section>

    <script src="bower_components/jquery/jquery.js"></script>
    <script src="bower_components/foundation/js/foundation.min.js"></script>
    <script src="includes/js/snap.svg-min.js"></script>
    <script type="text/javascript" src="includes/js/audio.js"></script>
  </body>
</html>
