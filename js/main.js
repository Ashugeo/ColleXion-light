var screen = 1;
var breadcrumb = ["Nearby devices"];

$(document).ready(function() {
    window.setTimeout(function() {
        $('.loading-status span').html('Scanning the room...');
    }, 2000);
    window.setTimeout(function() {
        $('.main').css('transform', 'translateX(' + -screen*100 + '%)');
        $('.header').addClass('visible');
        $('body').css('background-position', -screen*320 + 'px');
    }, 4000);
});

$(document).on('click', '.back', function() {
    if ($('.songs').hasClass('visible')) {
        $('.album.selected').removeClass('selected').css('top', '');
        $('.songs').removeClass('visible');
        $('.music').css('overflow-y', '');
        $('.songs').css('top', '');
        $('.album-colors').removeClass (function (index, css) {
            return (css.match (/(^|\s)selected-\S+/g) || []).join(' ');
        });

        $('.album').each(function() {
            $(this).removeClass('hide');
        });
    } else if (screen > 1) {
        screen--;
        breadcrumb.pop();
        $('.main').css('transform', 'translateX(' + -screen*100 + '%)');
        $('body').css('background-position', -screen*100 + 'px');
    }

    $('.header h1').html(breadcrumb[breadcrumb.length - 1]);
    $('.songs .selected').removeClass('selected');
})

$(document).on('click', '.dir', function() {
    breadcrumb.push($(this).html());
    $('.header h1').html(breadcrumb[breadcrumb.length - 1]);

    screen++;
    $('.main').css('transform', 'translateX(' + -screen*100 + '%)');
    $('body').css('background-position', -screen*320 + 'px');
})

$(document).on('click', '.album', function() {
    $('.album').each(function() {
        $(this).css('top', '');
    });
    $('.songs').toggleClass('visible');
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

    $('.album-colors').addClass('selected-' + $(this).attr('data-album'));
});

var artist_prev = '';

$(document).on('click', '.song', function() {
    var img = $(this).closest('.songs').find('.cover').attr('src');
    var track = $(this).find('.track').html();
    var artist = $(this).closest('.songs').find('.artist').html();

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
});
