$(document).ready(function() {
  // onload
    $("td").css("visibility", "visible");
    console.log('Game Started');
  // fist move
    $("td").click(function() {
      move(this, humanPlayer, humanColor);
      console.log("ai turn");
    });
  });

  var gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var humanPlayer = "P";
  var aiPlayer = "C";
  var it = 0;
  var round = 0;
  var aiColor = "red"; 
  var humanColor = "blue";

  function reset() {
    round = 0;
    gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    $("td").css("background-color", "transparent");
  }

  // winning logic
  function win(gameBoard, player) {
    if (
      (gameBoard[0] == player && gameBoard[1] == player && gameBoard[2] == player) ||
      (gameBoard[3] == player && gameBoard[4] == player && gameBoard[5] == player) ||
      (gameBoard[6] == player && gameBoard[7] == player && gameBoard[8] == player) ||
      (gameBoard[0] == player && gameBoard[3] == player && gameBoard[6] == player) ||
      (gameBoard[1] == player && gameBoard[4] == player && gameBoard[7] == player) ||
      (gameBoard[2] == player && gameBoard[5] == player && gameBoard[8] == player) ||
      (gameBoard[0] == player && gameBoard[4] == player && gameBoard[8] == player) ||
      (gameBoard[2] == player && gameBoard[4] == player && gameBoard[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  function move(element, player, color) {
    console.log("element "+ element.id);

    // if game board isn't fill (ai play)
    if (gameBoard[element.id] != "P" && gameBoard[element.id] != "C") {
      round++;
      $(element).css("background-color", color);
      gameBoard[element.id] = player;
      console.log(gameBoard);
  
      // if winning logic is true
      if (win(gameBoard, player)) {
        setTimeout(function() {
          alert("YOU WIN");
          reset();
        }, 500);
        return;
      }
      // if game exeeds more than 8 round (0+8)
      else if (round > 8) {
        setTimeout(function() {
          alert("TIE");
          reset();
        }, 500);
        return;
      }
      
      // else keep playing, use minmax
      else {
        round++;
        var index = minimax(gameBoard, aiPlayer).index;
        var selector = "#" + index;
        $(selector).css("background-color", aiColor);
        gameBoard[index] = aiPlayer;
        console.log(gameBoard);
        console.log(index);
        // win ?
        if (win(gameBoard, aiPlayer)) {
          setTimeout(function() {
            alert("YOU LOSE");
            reset();
          }, 500);
          return;
        } else if (round === 0) {
          setTimeout(function() {
            alert("TIE");
            reset();
          }, 500);
          return;
        }
      }
    }
  }

  //available index
  function avail(reboard) {
    return reboard.filter(s => s != "P" && s != "C");
  }
  
  function minimax(reboard, player) {
    it++;
    let array = avail(reboard);


    if (win(reboard, humanPlayer)) {
      return {
        score: -10
      };
    } else if (win(reboard, aiPlayer)) {
      return {
        score: 10
      };
    } else if (array.length === 0) {
      return {
        score: 0
      };
    }
  
    var moves = [];
    //backtrack tree
    for (var i = 0; i < array.length; i++) {
      var move = {};
      move.index = reboard[array[i]];
      reboard[array[i]] = player;
  
      if (player == aiPlayer) {
        var g = minimax(reboard, humanPlayer);
        move.score = g.score;
      } else {
        var g = minimax(reboard, aiPlayer);
        move.score = g.score;
      }
      reboard[array[i]] = move.index;
      moves.push(move);
    }
  
    var bestMove;
    // calculate best move
    if (player === aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }