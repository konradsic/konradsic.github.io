<!DOCTYPE html>
<html>
  <head>
    <title>Połącz pola - gra</title>
    <meta charset="utf-8" />
    <meta
      name="keywords"
      content="polacz, pole, gra, polaczpola, grapolaczpole"
    />
    <meta
      name="description"
      content="Gra w której należy łączyć pola tego samego koloru aby wygrać!"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <link
      rel="icon"
      href="img/block_logo_v1.png"
      type="image/x-icon"
    />
    <!-------------------------------------------------------------------------------------------------------------------------->
    <link rel="stylesheet" type="text/css" href="assets/style.css" />
  </head>
  <body>
    <?php
      // php section that redirects when level difficulty is not correct or it does not exist 
      $level = isset($_GET['level']);
      if ($level) {
        $level = $_GET['level'];
        if (!(($level == "easy") || ($level == "medium") || ($level == "hard"))) {
          header("Location: ?level=easy");
        }
      } else {
        header("Location: ?level=easy");
      }
    ?>
    <center>
      <h2>Połącz pola - gra!</h2>

      <div id="score">
        <b id="score-text">Wynik: </b>
        <span id="score-number">0</span>
        <span id="score-points-added"></span>
      </div>
      <br />
      <div id="game-container">
        <canvas id="gameboard" width="600px" height="600px"></canvas>
        <div id="timer">
          <fieldset>
            <legend><b>Czas</b></legend>
            Pozostało: <span id="time-left" style="font-weight: 500;"></span>
          </fieldset>
        </div>
        <div class="options-menu">
          <fieldset>
            <legend><b> Menu </b></legend>
            <h3> Opcje gry </h3>
            <span style="font-weight: 500;">Poziom trudności:</span>
            <br />
            <form method="POST" action="index?level=easy">
              <button type="submit" id="easy" class="select-level button-color-green">Łatwy</button>
            </form>
            <form method="POST" action="index?level=medium">
              <button type="submit" id="medium" class="select-level button-color-yellow">Średni</button>
            </form>
            <form method="POST" action="index?level=hard">
              <button type="submit" id="hard" class="select-level button-color-red">Trudny</button>
            </form>
            <br><br><br>
            <button onclick="restartLevelFromButton();" type="submit" id="button-restart">Restartuj grę</button>
            <br /><br /><br />
            <h3> Statystyki </h3>
            Poziom łatwy: <span style="font-weight: 500" id="stats-easy">0</span><br />
            Poziom średni: <span style="font-weight: 500" id="stats-medium">0</span><br />
            Poziom trudny: <span style="font-weight: 500" id="stats-hard">0</span><br />
          </fieldset>
        </div>
          
      </div>
      <br />
      <b class="big" id="howtoplay">Jak grać?</b><br />
      Zadaniem gracza jest zaznaczenie wszystkich sąsiadujących pól o tym samym kolorze.
      Zaznaczone pola o tym samym kolorze znikają a pozostałe spadają w dół.
      <br />
      W pojedynczym ruchu gracz może zaznaczyć minimalnie 4 sąsiadujące pola o
      tym samym kolorze aby otrzymać punkty. Zaznaczenie pól o różnych kolorach
      oznacza stratę punktów. Sąsiadujące pola to takie które mają wspólny bok. Zaznaczanie musi odbywać
      się w jednym ciągu, nie można zaznaczyć pól które nie są bezpośrednimi
      sąsiadami. <br />

      <b class="big" id="score-table">Punktacja</b><br />
      Każde sąsiednie zaznaczone pole <b class="points green">+100 i bonusy</b> w przypadku zaznaczenia złego pola <b class="points red">-200</b><br />
      Aby wygrać należy zaznaczać pola dopóki
      <b class="points blue">nie będzie</b> możliwości zaznaczenia minimalnie 4
      sąsiadujących pól<br />
    </center>
    <script src="assets/app.js"></script>
  </body>
</html>
