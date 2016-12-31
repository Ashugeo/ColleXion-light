var screen = 1;
var breadcrumb = ["Nearby devices"];

$(document).ready(function() {
    window.setTimeout(function() {
        $('.loading-status span').html('Scanning the room...');
    }, 200);
    window.setTimeout(function() {
        $('.main').css('transform', 'translateX(' + -screen*100 + '%)');
        $('.header').addClass('visible');
        $('#wrapper').css('background-position', -screen*320 + 'px');
    }, 400);
});

$(document).on('click', '.back', function() {
    if ($('.player').hasClass('open')) {
        $('.player').removeClass('open');
        return false;
    }
    if ($('.songs').hasClass('visible')) {
        $('.album.selected').removeClass('selected').css('top', '');
        $('.songs').removeClass('visible');
        $('.music').css('overflow-y', '');
        $('.songs').css('top', '');
        // $('.album-colors').removeClass (function (index, css) {
        //     return (css.match (/(^|\s)selected-\S+/g) || []).join(' ');
        // });
        $('.album-colors').removeClass('selected');

        $('.album').each(function() {
            $(this).removeClass('hide');
        });
    } else if (screen > 1) {
        screen--;
        breadcrumb.pop();
        $('.main').css('transform', 'translateX(' + -screen*100 + '%)');
        $('#wrapper').css('background-position', -screen*100 + 'px');
    }

    $('.header h1').html(breadcrumb[breadcrumb.length - 1]);
    $('.songs .selected').removeClass('selected');
})

$(document).on('click', '.dir', function() {
    breadcrumb.push($(this).html());
    $('.header h1').html(breadcrumb[breadcrumb.length - 1]);

    screen++;
    $('.main').css('transform', 'translateX(' + -screen*100 + '%)');
    $('#wrapper').css('background-position', -screen*320 + 'px');
})

$(document).on('click', '.album', function() {
    getAlbum($(this).attr('data-id'));
    $('.album').each(function() {
        $(this).css('top', '');
    });
    // $('.songs').toggleClass('visible');
    $('.songs ul').scrollTop(0);
    $(this).toggleClass('selected');
    if ($(this).hasClass('selected')) {
        $('.album').each(function() {
            $(this).addClass('hide');
        });
        $('.music').css('overflow-y', 'hidden');
        $(this).css('top', $('.music').scrollTop());
        $('.songs').css('top', $('.music').scrollTop());
        $('.songs .info .cover').attr('src', $(this).find('.cover').attr('src'));
        $('.songs .info .title').html($(this).find('.title').html());
        $('.songs .info .artist').html($(this).find('.artist').html());
    } else {
        $('.album').each(function() {
            $(this).removeClass('hide');
        });
        $('.music').css('overflow-y', '');
        $('.songs').css('top', '');
    }

    // $('.album-colors').addClass('selected-' + $(this).attr('data-album'));
    $('.album-colors').attr('data-colors', $(this).attr('data-album')).addClass('selected');
});

var artist_prev = '',
duration;

$(document).on('click', '.song', function() {
    var img = $(this).closest('.songs').find('.cover').attr('src');
    var track = $(this).find('.track').html();
    var artist = $(this).closest('.songs').find('.artist').html();
    duration = $(this).attr('data-duration');
    $('.progress').css({
        'transform': 'scaleX(0)',
        'transition': 'none'
    });
    $('.progress-track .handle').css({
        'transition': '',
        'transform' : ''
    });
    timeout = setTimeout(function () {
        $('.progress').css({
            'transition': 'transform '+parseFloat(duration)+'s linear',
            'transform': 'scaleX(1)'
        });
        $('.progress-track .handle').css({
            'transition': 'transform '+parseFloat(duration)+'s linear',
            'transform' : 'translateX(270px)'
        });
    }, 100);

    if (artist != artist_prev) {
        $('.player .cover').addClass('flip');
        window.setTimeout(function() {
            $('.player .cover').removeClass('flip');
        }, 1000);
    }

    artist_prev = artist;

    $('.song.selected').removeClass('selected');
    $(this).addClass('selected');

    window.setTimeout(function() {
        $('.player .cover').attr('src', img);
    }, 200);

    $('.player .title').html(track);
    $('.player .artist').html(artist);

    $('.player').addClass('visible');
    $('.eq-anim').remove();
    $(this).find('.track').append('<div class="eq-anim"></div>');
    $('.play').removeClass('play').addClass('pause');

    progress();
});

// var Y = 0,
// originY = 0,
// clicking = false;
//
// $(document).on('mousemove', '#wrapper', function(e) {
//     $('.cursor').css({left: e.pageX, top: e.pageY});
//     if (clicking && $(e.target).hasClass('draggable')) {
//         $(e.target).css('margin-top', Math.max(Math.min(-Y + originY + e.pageY, 0), -$(e.target).outerHeight()));
//     }
// });
//
// $(document).on('mousedown', '#wrapper', function(e) {
//     clicking = true;
//     originY = parseFloat($(e.target).css('margin-top'));
//     Y = e.pageY;
//     $('.cursor').addClass('visible');
// });
//
// $(document).on('mouseup', '#wrapper', function() {
//     clicking = false;
//     $('.cursor').removeClass('visible');
// });

function getAlbum(id) {
    if (id) {
        var i = 0;
        return $.getJSON('http://itunes.apple.com/lookup?id='+ id +'&entity=song&callback=?', function(data) {
            $('.songs').removeClass('visible');
            $('.songs ul').empty();

            for (var key in data){
                for (value in data[key]) {
                    trackName = data[key][value]["trackName"];
                    trackTimeMillis = data[key][value]["trackTimeMillis"];
                    previewUrl = data[key][value]["previewUrl"];

                    seconds = Math.round((trackTimeMillis / 1000) % 60);
                    seconds < 10 ? seconds = "0" + seconds : true;
                    minutes = Math.floor(trackTimeMillis / (1000*60) % 60);

                    if (trackName) {
                        $('.songs ul').append('<li class="song" data-duration="'+trackTimeMillis/1000+'"><span class="track">'+trackName+'</span><span class="duration">'+minutes+':'+seconds+'</span></li>');
                    }
                    i++;
                }
            }
        }).done(function() {
            timeout = setTimeout(function() {
                $('.songs').addClass('visible');
            }, 100);
        });
    }
}

$(document).on('click', '.external', function() {
    if ($('.player').hasClass('open-renderers')) {
        $('.player').removeClass('open-renderers');
        $('.player').css('bottom', '');
    } else {
        $('.player').addClass('open-renderers');
        $('.player').css('bottom', 'calc(-100% + ' + ($('.renderers').outerHeight() + 65) + 'px)');
    }
});

$(document).on('click', '.info', function(e) {
    if ($(e.target).hasClass('button')) {
        return false;
    }
    $('.player').css('bottom', '').removeClass('open-renderers').toggleClass('open');
});

$(document).on('click', '.main, .header', function() {
    $('.player').removeClass('open-renderers')
    $('.player').css('bottom', '');
});

$(document).on('click', '.renderers li', function() {
    $('.active-renderer').removeClass('active-renderer');
    $(this).addClass('active-renderer');
});

var progressTransform,
progressTransition,
handleTransform;

$(document).on('click', '.pause, .play', function() {
    if ($(this).hasClass('play')) {
        $(this).removeClass('play').addClass('pause');
        $('.eq-anim').css('display', 'inline-block');
        $('.progress').css({
            'transform' : 'scaleX(1)',
            'transition' : progressTransition // wrong timing
        });
        $('.progress-track .handle').css({
            'transform' : 'translateX(270px)',
            'transition' : progressTransition
        });

        paused = false;
        progress(time);

    } else if ($(this).hasClass('pause')) {
        $(this).removeClass('pause').addClass('play');
        progressTransform = $('.progress').css('transform');
        progressTransition = $('.progress').css('transition');
        handleTransform = $('.handle').css('transform');
        $('.progress').css({
            'transform' : progressTransform,
            'transition' : 'none'
        });
        $('.progress-track .handle').css({
            'transform' : handleTransform,
            'transition' : ''
        });
        $('.eq-anim').css('display', 'none');

        clearTimeout(boucle);
        paused = true;
    }
});

var paused = false,
time = 0,
boucle,
elapsedSeconds,
elapsedMinutes,
remainingSeconds,
remainingMinutes;

function progress(step) {
    if (!step) {
        time = 0;
        clearTimeout(boucle);
        // console.log(duration);
        seconds = Math.round((duration) % 60);
        seconds < 10 ? seconds = "0" + seconds : true;
        minutes = Math.floor(duration/60) % 60;
        $('.elapsed').html('0:00');
        $('.remaining').html('-' + minutes + ':' + seconds);

        remainingSeconds = seconds;
        remainingMinutes = minutes;
    }
    if (!paused) {
        boucle = setTimeout(function() {
            time++;
            elapsedSeconds = time - (Math.floor(time/60) % 60)*60;
            elapsedMinutes = Math.floor(time/60) % 60;
            elapsedSeconds < 10 ? elapsedSeconds = "0" + elapsedSeconds : true;

            remainingSeconds--;
            if (remainingSeconds < 0) {
                remainingSeconds = 59;
                remainingMinutes--;
            }
            remainingSeconds < 10 ? remainingSeconds = "0" + remainingSeconds : true;

            // console.log('elapsed  ', elapsedMinutes, ':', elapsedSeconds);
            // console.log('remaining', remainingMinutes, ':', remainingSeconds);

            $('.elapsed').html(elapsedMinutes+':'+elapsedSeconds);
            $('.remaining').html('-'+remainingMinutes+':'+remainingSeconds);

            progress(time);
        }, 1000);

        if (remainingSeconds == 0 && remainingMinutes == 0) {
            clearTimeout(boucle);
            // $('.eq-anim').remove();
        }
    }
}

$(document).on('touchmove', '.volume .handle', function(e) {
    $(this).css('left', Math.max(Math.min(e.originalEvent.touches[0].pageX - 60, 210), -10));
    $('.volume').css('width', Math.max(Math.min(e.originalEvent.touches[0].pageX - 60, 210), 0));
});
