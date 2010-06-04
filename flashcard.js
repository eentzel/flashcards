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
        round = 0,
        GAME_LENGTH = 10;

    function factors() {
        return [].slice.call( $('.factor'), 0 ).map( function(n) { return n.innerHTML; } );
    }

    function product() {
        return factors().reduce( function(x, y) { return x * y; } );
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
        showMessage( 'Correct!', f[0] + ' &times; ' + f[1] + ' = ' + answer.val() );
    }

    function showFailure() {
        var f = factors();
        showMessage( 'Sorry...',
                     f[0] + ' &times; ' + f[1] + ' is not equal to ' + answer.val(),
                     f[0] + ' &times; ' + f[1] + ' = ' + product() );
    }

    function showGameEnd() {
        $('.picOverlay').show();
        $('.problem').hide();
        showMessage( 'You got ' + correct.text() + ' out of ' + attempted.text() + ' correct.' );
        answer.val('').focus();
    }

    function randInt(max) {
        return Math.floor( Math.random() * max );
    }

    function newProblem() {
        $('.factor').each( function(idx, el) { el.innerHTML = randInt(11); } );
        answer.val('').focus();
    }

    function newGame() {
        $('.picOverlay').hide();
        $('.problem').show();
        attempted.text('0');
        correct.text('0');
        $('.score').html('&nbsp;');
        newProblem();
    }

    function update() {
        if ( attempted.toInt() >= GAME_LENGTH ) {
            newGame();
            return false;
        }
        else if ( answer.val() === '' ) {
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
        if ( attempted.toInt() >= GAME_LENGTH ) {
            showGameEnd();
        }
        else {
            newProblem();
        }

        return false;
    }

    function init() {
        $('form').submit(update);
        newProblem();
    }

    return {
        isCorrect: isCorrect,
        update: update,
        init: init
    };
})();

$(document).ready(FLASHCARDS.init);