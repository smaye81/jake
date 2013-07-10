/*global require, console, _, $ */
require(["jake"],

    function (jake) {

        'use strict';

        var extendExample = function () {

            // Example taken from jQuery documentation
            var object1 = {
                apple: 0,
                banana: {weight: 52, price: 100},
                cherry: 97
            };
            var object2 = {
                banana: {price: 200},
                durian: 100
            };

            var newObj = jake.extend(true, object1, object2);

            $('#extendExample').html(JSON.stringify(newObj));
        },
            eachExample = function () {
                var arr = [ "one", "two", "three", "four", "five" ];
                var obj = { one:1, two:2, three:3, four:4, five:5 };

                jake.each(arr, function() {
                    $("#" + this).text("Mine is " + this + ".");
                    return (this != "three"); // will stop running after "three"
                });

                jake.each(obj, function(i, val) {
                    $("#" + i).append(document.createTextNode(" - " + val));
                });
            },

            offsetExample = function () {

                var offSet = jake.offset(document.getElementById('extendExample'));


                $('#offsetExample').html(JSON.stringify(offSet));
            };

        $(function () {

            extendExample();
            eachExample();
            offsetExample();


        })
    });