(function() {
    'use strict';

    var movies = [];

    var renderMovies = function() {
        $('#listings').empty();

        for (var movie of movies) {
            var $col = $('<div class="col s6">');
            var $card = $('<div class="card hoverable">');
            var $content = $('<div class="card-content center">');
            var $title = $('<h6 class="card-title truncate">');

            $title.attr({
                'data-position': 'top',
                'data-tooltip': movie.Title
            });

            $title.tooltip({
                delay: 50,
            });
            $title.text(movie.Title);

            var $poster = $('<img class="poster">');

            $poster.attr({
                src: movie.Poster,
                alt: `${movie.Poster} Poster`
            });

            $content.append($title, $poster);
            $card.append($content);

            var $action = $('<div class="card-action center">');
            var $plot = $('<a class="waves-effect waves-light btn modal-trigger">');

            $plot.attr('href', `#${movie.id}`);
            $plot.text('Plot Synopsis');

            $action.append($plot);
            $card.append($action);

            var $modal = $(`<div id="${movie.id}" class="modal">`);
            var $modalContent = $('<div class="modal-content">');
            var $modalHeader = $('<h4>').text(movie.Title);
            var $movieYear = $('<h6>').text(`Released in ${movie.Year}`);
            var $modalText = $('<p>').text(movie.Plot);

            $modalContent.append($modalHeader, $movieYear, $modalText);
            $modal.append($modalContent);

            $col.append($card, $modal);

            $('#listings').append($col);

            $('.modal-trigger').leanModal();
        }
    };

    // ADD YOUR CODE HERE
    // var data;



    var movieToSearch;
    var y;
    function changeSearchTerm(term) {
        movieToSearch = term;
    }
    $('#searchButton').on('click', function(event) {
        movies = [];
        event.preventDefault();
        var movieName = $('#search').val();
        changeSearchTerm(movieName);
        $.ajax({
            method: 'GET',
            url: `http://omdbapi.com/?s=${movieToSearch}`,
            dataType: 'json',
            success: function(data) {
                let listMovies = data.Search;
                for (var i = 0; i < listMovies.length; i++) {
                    let movie = listMovies[i]
                    let title = movie.Title;
                    $.ajax({
                        method: 'GET',
                        url: `http://omdbapi.com/?t=${title}`,
                        dataType: 'json',
                        success: function(newData) {
                          let pMovies = newData
                          movies.push(pMovies)
                        },
                        error: function(newErr) {
                            console.log('Error', newErr);
                        }
                    })
                    renderMovies();
                }
            },
            error: function(err) {
                console.log('Error', err);
            }
        })
    })
})();
