function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

angular.module('mainApp', ["webcam"])
    .controller('mainController', function($rootScope, $scope, $location, $timeout, $interval) {
        var socket = io();
        var _video = null;

        $scope.free = 6;
        $scope.curFree = 6;
        $scope.total = 6;

        $scope.canvases = {};
        $scope.contexes = {};

        $scope.canvases["person"] = $("#cowCanvas")[0];
        $scope.contexes["person"] = $("#cowCanvas")[0].getContext("2d");
        $scope.contexes["person"].strokeStyle = "#FF0000";

        // video
        $scope.patOpts = {
            x: 0,
            y: 0,
            w: 50,
            h: 50
        };
        $scope.myChannel = {
            videoWidth: 320,
            videoHeight: 240,
            video: null
        };

        $interval(function() {
            $scope.makeSnapshot();
        }, 1000);

        $scope.makeSnapshot = function makeSnapshot() {
            if (_video) {
                var patCanvas = document.createElement('canvas');
                patCanvas.width = _video.width;
                patCanvas.height = _video.height;
                var ctxPat = patCanvas.getContext('2d');

                var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
                ctxPat.putImageData(idata, 0, 0);

                //console.log(patCanvas.toDataURL('image/jpeg'));

                // send to server to dump the image
                socket.emit('snapshot', patCanvas.toDataURL('image/jpeg'));
            }
        };

        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = _video.width;
            hiddenCanvas.height = _video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, _video.width, _video.height);
            return ctx.getImageData(x, y, w, h);
        };

        $scope.onError = function(err) {}

        $scope.onStream = function(stream) {}

        $scope.onSuccess = function() {
            _video = $scope.myChannel.video;
            $scope.$apply(function() {
                $scope.patOpts.w = _video.width;
                $scope.patOpts.h = _video.height;
            });
        }

        //////////////////////////////////////////////////////
        $scope.updateBoundingBox = function(type, bboxes) {
            $scope.contexes[type].clearRect(0, 0, $scope.canvases[type].width, $scope.canvases[type].height);
            for (var i = 0; i < bboxes.length; i++) {
                var bbox = bboxes[i];
                $scope.contexes[type].beginPath()
                $scope.contexes[type].rect(1200.0 * (bbox.x / 320), 900.0 * (bbox.y / 240), 1200.0 * (bbox.w / 320), 900.0 * (bbox.h / 240));
                $scope.contexes[type].lineWidth = 4;
                $scope.contexes[type].stroke();

                $scope.contexes[type].font = "15pt ben-light";
                $scope.contexes[type].fillStyle = "red";
                $scope.contexes[type].fillText(bbox.name, 1200.0 * (bbox.x / 320), 900.0 * (bbox.y / 240) - 10);
            }
        }

        socket.on('person', function(msg) {
            $scope.$apply(function() {
                console.log(msg);

                $scope.updateBoundingBox('person', msg);
            });
        });
    });
