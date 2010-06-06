/*jslint browser: true, onevar: true, undef: true, eqeqeq: true */
/*global $ jQuery */

jQuery.fn.toInt = function() {
    var v = this.val() || this.text();
    return parseInt(v, 10);
};

var FLASHCARDS = (function(){
    var correct = $('.correct'),
        attempted = $('.attempted'),
        answer = $('.answer'),
        gameOver,
        operation,
        GAME_LENGTH = 15,

        // operation objects:
        Add, Subtract, Multipy, Divide;

    function factors() {
        return [].slice.call( $('.factor'), 0 ).map( function(n) { return n.innerHTML; } );
    }

    function product() {
        return factors().reduce( operation.perform );
    }

    function opText() {
        return ' ' + $('.operator').text() + ' ';
    }

    function score() {
        var s = correct.toInt() / attempted.toInt();
        return (s * 100).toFixed(2);
    }

    function isCorrect() {
        return product() === answer.toInt();
    }

    function increment(el, ceil) {
        var val = el.toInt() + 1;
        if ( ceil ) {
            val = val % ceil;
        }
        el.text( val );
    }

    function showMessage() {
        var messageArgs = arguments;
        $('.message').children().each( function( i, el ) {
            if ( messageArgs[i] ) {
                el.innerHTML = messageArgs[i];
            }
        } );
    }

    function showSucces() {
        var f = factors();
        showMessage( 'Correct!', f[0] + opText() + f[1] + ' = ' + product() );
    }

    function showFailure() {
        var f = factors();
        showMessage( 'Sorry...',
                     f[0] + opText() + f[1] + ' is not equal to ' + answer.val(),
                     f[0] + opText() + f[1] + ' = ' + product() );
    }

    function showGameEnd() {
        gameOver = true;
        $('.picOverlay').show();
        $('.problem').hide();
        showMessage( 'You got ' + correct.text() + ' out of ' + attempted.text() + ' correct.' );
        answer.val('').focus();
    }

    function randInt(max) {
        return Math.floor( Math.random() * max );
    }

    function newProblem() {
        var numbers = operation.generate();
        $('.factor').each( function(idx, el) { el.innerHTML = numbers[idx]; } );
        answer.val('').focus();
    }

    function changeOperation(e) {
        var target = e.currentTarget,
            name = target.className.match( /Add|Subtract|Multiply|Divide/ )[0];

        $('.operator').html( target.innerHTML );
        $('.operations .active').removeClass('active');
        $(target).addClass('active');

        operation = FLASHCARDS[name];
        newProblem();

        e.preventDefault();
    }

    function newGame() {
        newProblem();
        $('.picOverlay').hide();
        $('.problem').show();

        attempted.text('0');
        correct.text('0');
        $('.score').html('&nbsp;');
        $('.minutes').text(GAME_LENGTH);
        $('.seconds').text('00');

        gameOver = false;
    }

    function update() {
        if ( gameOver || answer.val() === '' ) {
            return false;
        }
        increment(attempted);
        if ( isCorrect() ) {
            showSucces();
            increment(correct);
        }
        else {
            showFailure();
        }
        $('.score').text( score() + '%' );
        newProblem();

        return false;
    }

    function format(n) {
        return n > 9 ? n : '0' + n;
    }

    function startTimer() {
        var timer = window.setInterval( function() {
            var m = $('.minutes').toInt(),
                s = $('.seconds').toInt();
            s -= 1;
            if (s === 0 && m === 0) {
                window.clearInterval(timer);
                showGameEnd();
            }
            else if (s === -1) {
                s = 59;
                m -= 1;
            }
            $('.minutes').text( format(m) );
            $('.seconds').text( format(s) );
        }, 1000 );
        $('form').unbind('submit', startTimer);
    }

    function init() {
        operation = Multiply;
        $('form').submit(update).submit(startTimer);
        $('.operations .button').click(changeOperation);
        $('.newGame').click(newGame);
        newGame();
    }

    Add = {
        // without parseInt(), this is interpreted as string concatenation:
        perform: function(x, y) { return parseInt(x, 10) + parseInt(y, 10); },
        generate: function() {
            return [ randInt(11), randInt(11) ];
        }
    };

    Subtract = {
        perform: function(x, y) { return x - y; },
        generate: function() {
            var first = randInt(16),
                second = randInt(first);
            return [first, second];
        }
    };

    Multiply = {
        perform: function(x, y) { return x * y; },
        generate: Add.generate
    };

    Divide = {
        perform: function(x, y) { return x / y; },
        generate: function() {
            var second = randInt(10) + 1,
                first = randInt(11) * second;
            return [first, second];
        }
    };

    return {
        Add: Add,
        Subtract: Subtract,
        Multiply: Multiply,
        Divide: Divide,
        init: init
    };
})();

$(document).ready(FLASHCARDS.init);