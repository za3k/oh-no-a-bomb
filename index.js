const initTimeLeft = // 15:00 game minutes
    window.location.href.startsWith("file") ? 900 : 120;

const game = {
    level: 0,
    detonationTime: null,
    speedup: 2.0,
    changeTime: function(seconds) {
        const MAX_TIME = 35999; // 9:99:99
        this.timeLeft = Math.max(0, Math.min(MAX_TIME, this.timeLeft + seconds));
    },
    scaleSpeedup: function(mult) {
        const timeLeft = this.timeLeft;
        this.speedup *= mult;
        this.timeLeft = timeLeft;
    }
};
Object.defineProperty(game, 'timeLeft', {
    get: function() {
        return Math.max(detonationTime - now(), 0) * this.speedup;
    },
    set: function(newTimeLeft) {
        detonationTime = now() + newTimeLeft / this.speedup;
    }
});

function soundEffect(x) {
    document.getElementById(x + "Sound").play();
}

const SECONDS_PER_TICK = 2;
function tickTock() {
    tickTock.tick = !tickTock.tick;
    $(".tick,.tock").toggleClass("hidden");
    soundEffect("tick");
}

function updateCountdown() {
    const timeLeft = game.timeLeft;
    $(".countdown.hours").text(Math.floor(timeLeft / 3600));
    $(".countdown.minutes").text(Math.floor((timeLeft / 60) % 60).toString().padStart(2, '0'));
    $(".countdown.seconds").text(Math.floor(timeLeft % 60).toString().padStart(2, '0'));
    $(".countdown.centiseconds").text(Math.floor(timeLeft % 1 * 100).toString().padStart(2, '0'));

    $(".countdown.hours, .countdown.hours + .countdown.separator").toggle(timeLeft >= 3600);
    $(".countdown.minutes, .countdown.minutes + .countdown.separator").toggle(timeLeft > 60);
    $(".countdown.centiseconds, .countdown.dot").toggle(timeLeft < 3600);
    // Did we pass a second boundry?
    if (timeLeft < updateCountdown.nextSecond) tickTock();
    updateCountdown.nextSecond= Math.floor(timeLeft/SECONDS_PER_TICK)*SECONDS_PER_TICK;

    if (timeLeft <= 0) explode();
}

function now() {
    return new Date().getTime() / 1000.0;
}

function start() {
    game.timeLeft = initTimeLeft;
    start.update = setInterval(updateCountdown, 5);
}

function stop(exploded) {
    clearInterval(start.ticktock);
    clearInterval(start.update);

    $("body > *").hide();
    $(".after-game").show();

    if (exploded) soundEffect("explosion");
}

function explode() {
    stop(true);
}

function dontExplode() {
    //stop(false);
    soundEffect("correct");
    game.level++;
    $(".dontexplode-button").hide();
    $(".fakedontexplode-button").show();
    $(".explode-button").hide();
    $(".level1, .level2, .level3").hide();
    $(".level" + game.level.toString()).show();
    if (game.level == 1) {

    } else if (game.level == 2) {

    } else if (game.level == 3) {

    } else if (game.level >= 3) {
        stop(false);
    }
}
function fakeDontExplode() {
    $(".dontexplode-button").hide();
    $(".fakedontexplode-button").hide();
    $(".explode-button").show();
    game.scaleSpeedup(2.5);
    soundEffect("wrong");
}

function solveRiddle(solved) {
    if (solved) {
        $(".dontexplode-button").show();
        $(".fakedontexplode-button").hide();
        $(".explode-button").hide();
    } else {
        $(".dontexplode-button").hide();
        $(".fakedontexplode-button").show();
        $(".explode-button").hide();
    }
}

$(".package").on("click", () => {
    $("body > *").hide();
    $(".level1, .level2, .level3").hide();
    $(".game").show();
    start();
});

$("a").on("click", (ev) => {
    const name = $(ev.target).data("function");

    console.log(name);
    window[name]();
});
