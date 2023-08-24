const initTimeLeft = // 15:00 game minutes
    window.location.href.startsWith("file") ? 900 : 120;

const game = {
    difficulty: 1,
    detonationTime: null,
    speedup: 5.0,
    changeTime: function(seconds) {
        const MAX_TIME = 35999; // 9:99:99
        this.timeLeft = Math.max(0, Math.min(MAX_TIME, this.timeLeft + seconds));
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

    if (timeLeft <= 0) stop();
}

function now() {
    return new Date().getTime() / 1000.0;
}

function start() {
    game.timeLeft = initTimeLeft;
    start.ticktock = setInterval(tickTock, 500);
    start.update = setInterval(updateCountdown, 5);
}

function stop() {
    clearInterval(start.ticktock);
    clearInterval(start.update);

    $("body > *").hide();
    $(".after-game").show();

    soundEffect("explosion");
}

$(".package").on("click", () => {
    $("body > *").hide();
    $(".game").show();
    start();
});

for (var i = 1; i < 6; i++) {
    Array.prototype.slice.call(document.getElementsByClassName('preset' + i)).forEach(function(el) {
        new Knob(el, new Ui['P' + i]());
        el.addEventListener('change', function  () {
            console.log(el.value)
        })
    })
}
