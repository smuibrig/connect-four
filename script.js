(function () {
    var COLUMNS = 7;
    var SLOTS = 6;
    var nameOne = "Player One";
    var nameTwo = "Player Two";

    // Returns a new board as a 2D array of slots
    function newBoard() {
        var board = [];
        for (var i = 0; i < COLUMNS; i++) {
            var column = [];
            for (var j = 0; j < SLOTS; j++) {
                column.push(0);
            }
            board.push(column);
        }
        return board;
    }

    // Function that transposes a board
    function transpose(board) {
        return board[0].map(function (_, i) {
            return board.map(function (row) {
                return row[i];
            });
        });
    }

    function diagonals(board) {
        // prettier-ignore
        return [
            // Coordinates of a all possible diagonals on the board
            [[0, 2], [1, 3], [2, 4], [3, 5]],
            [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
            [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
            [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4], [6, 5]],
            [[2, 0], [3, 1], [4, 2], [5, 3], [6, 4]],
            [[3, 0], [4, 1], [5, 2], [6, 3]],
            [[0, 3], [1, 2], [2, 1], [3, 0]],
            [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]],
            [[0, 5], [1, 4], [2, 3], [3, 2], [4, 1], [5, 0]],
            [[1, 5], [2, 4], [3, 3], [4, 2], [5, 1], [6, 0]],
            [[2, 5], [3, 4], [4, 3], [5, 2], [6, 1]],
            [[3, 5], [4, 4], [5, 3], [6, 2]]
        ].map(function (diagonal) {  // Creating an iterable 2D array of the coordinates 
            return diagonal.map(function (coord) {
                var column = coord[0];
                var row = coord[1];
                return board[column][row];
            });
        });
    }

    // Function that iterates through an array of slots to find a winner.
    function findWinner(slots) {
        for (var start = slots.length - 1; start >= 0; start--) {
            // Checks if the first slots in a column is occupied by a player
            if (slots[start] == 0) {
                continue;
            }

            var end = start - 1;
            while (slots[end] == slots[start]) {
                end--;
                // One player occupies 4 slots in a column and wins
                if (start - end == 4) {
                    return slots[start]; // Return winner
                }
            }
        }
        // If there is no winner return nothing
        return 0;
    }

    function emptySlot(column, board) {
        if (board[column][0] != 0) {
            // Column is full
            return;
        }

        var slot;
        for (slot = board[column].length - 1; slot >= 0; slot--) {
            if (board[column][slot] == 0) {
                // Found a free slot in this column.
                return slot;
            }
        }
    }

    var board = newBoard();
    var currentPlayer = 1; // Player one begins the game;

    // Set names from input fields as players one and two 
    $("#name-one, #name-two").on("input", function () {
        nameOne = $("#name-one").val();
        nameTwo = $("#name-two").val();

        $("#nameOne").text(nameOne);
        $("#nameTwo").text(nameTwo);
    });

    $(".column").on("mouseover", function (e) {
        var col = $(e.currentTarget);
        var column = parseInt(col.attr("id").slice(1), 10);
        var slot = emptySlot(column, board);
        if (slot == undefined) {
            return;
        }
        col.find(".slot .circle").eq(slot).addClass("highlight");
    });

    $(".column").on("mouseout", function () {
        $(".circle").removeClass("highlight");
    });

    // Mousedown event to find which column was chosen by a player
    $(".column").on("mousedown", function (e) {
        var col = $(e.currentTarget);
        var column = parseInt(col.attr("id").slice(1), 10);

        $(".set-players").addClass("hide");

        var slot = emptySlot(column, board);
        if (slot == undefined) {
            return;
        }

        board[column][slot] = currentPlayer;

        // Updating the UI
        col.find(".slot .circle")
            .eq(slot)
            .removeClass("highlight")
            .addClass("player" + currentPlayer);

        if (currentPlayer === 1) {
            $("#playerTwo").addClass("highlight");
            $("#playerOne").removeClass("highlight");
        } else {
            $("#playerOne").addClass("highlight");
            $("#playerTwo").removeClass("highlight");
        }

        currentPlayer = currentPlayer == 1 ? 2 : 1; // Cycle player

        var winner = 0;

        // All columns, rows and diagonals in one array.
        var all = []
            .concat(board) // Columns
            .concat(transpose(board)) // Rows
            .concat(diagonals(board)); // Diagonals

        // Looping through the array to find a winner.
        for (var i = 0; i < all.length && winner == 0; i++) {
            winner = findWinner(all[i]);
        }

        if (winner != 0) {
            $(".player-container").addClass("hide");
            $("#board").addClass("win");
            $(".column").off();

            setTimeout(function () {
                $("#modal").addClass("player" + winner);
                if (winner == 1) {
                    $("#winner-text").text(nameOne + " wins!");
                } else {
                    $("#winner-text").text(nameTwo + " wins!");
                }
                $("#modal").removeClass("hide");
            }, 1000);

            setTimeout(function () {
                $("#board").removeClass("win");
                $("p").removeClass("none");
            }, 3000);

            $("body").on("keydown", function (e) {
                if (e.keyCode === 32) {
                    location.reload();
                }
            });
        }
    });
})();
