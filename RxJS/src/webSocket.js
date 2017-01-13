var Pusher = require('pusher');

const PUSHER_EVENT_NAME = 'status';

function getPusherStream(channelId) {
    return Observable.create(function (observer) {
        let pusher = new Pusher('12345', {
            encrypted: true,
        });
        const channel = pusher.subscribe(channelId);

        channel.bind(PUSHER_EVENT_NAME, function (data) {
            if (!data.error) {
                observer.next(data);
            } else {
                observer.error(data);
            }
        });

        channel.bind('pusher:subscription_error', function (status) {
            observer.error(status);
        });

        // Dispose function.
        return function () {
            pusher.unsubscribe(channelId);
            pusher = undefined;
        };
    });
}