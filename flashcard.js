/*jslint browser: true, onevar: true, undef: true, eqeqeq: true */
/*global $ jQuery */

var FLASHCARDS = (function(){
    var correct = $('.correct'),
        attempted = $('.attempted'),
        answer = $('.answer'),
        message = $('.message'),
        round = 0,
        GAME_LENGTH = 10;

    function factors() {
        return [].slice.call( $('.factor'), 0 ).map( function(n) { return n.innerHTML; } );
    }

    function product() {
        return factors().reduce( function(x, y) { return x * y; } );
    }

    function score() {
        var s = parseInt( correct.text(), 10 ) / parseInt( attempted.text(), 10 );
        return (s * 100).toFixed(2);
    }

    function isCorrect() {
        return product() === parseInt( answer.val(), 10 );
    }

    function increment(el, ceil) {
        var val = parseInt(el.text(), 10) + 1;
        if ( ceil ) {
            val = val % ceil;
        }
        el.text( val );
    }

    function showSucces() {
        message.html( "Correct!<br />" + factors()[0] + " x " + factors()[1] + " = " + answer.val() + "<br />&nbsp;");
        increment(correct);
    }

    function showFailure() {
        message.html( "Sorry...<br />" +
            factors()[0] + " x " + factors()[1] + " is not equal to " + answer.val() + "<br />" +
            factors()[0] + " x " + factors()[1] + " = " + product() );
    }

    function showGameEnd() {
        // TODO
    }

    function randInt(max) {
        return Math.floor( Math.random() * max );
    }

    function newProblem() {
        $('.factor').each( function(idx, el) { el.innerHTML = randInt(11); } );
    }

    function update() {
        if ( answer.val() === '' ) {
            return false;
        }

        if ( isCorrect() ) {
            showSucces();
        }
        else {
            showFailure();
        }

        // if ( round++ > GAME_LENGTH ) {
        //     showGameEnd();
        // }
        // else {
            newProblem();
        // }
        answer.val('').focus();
        increment(attempted);
        $('.score').text( score() + '%' );
        return false;
    }

    function init() {
        $('form').submit(update);
    }

    return {
        isCorrect: isCorrect,
        update: update,
        init: init
    };
})();

$(document).ready(FLASHCARDS.init);