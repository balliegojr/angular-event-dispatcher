# angular-eventDispatcher

An event dispatcher to be used with [angular](https://github.com/angular/angular.js) without the dependency of **$scope**

## Runing tests
```
karma start

or

gulp karma
```

## Build
```
gulp build
```

## Usage
Add [build/event-dispatcher.min.js](https://github.com/balliegojr/angular-event-dispatcher/blob/master/build/event-dispatcher.min.js) to your html file
```
<script src="[vendor_folder]/event-dispatcher.min.js"></script>
```
Add eventDispatcherModule as a requirement for your module

```
angular.module('myApp', ['eventDispatcherModule']);
```

Inject the eventDispatcher into your services
```
service('myService', ['eventDispatcher', function(eventDispather) {
	//fire the event
    eventDispatcher.trigger('myEvent', 'parameter');

}]);

controller('myController', ['eventDispatcher', function(eventDispather) {
    eventDispatcher.on('myEvent', function(arg) {
        // do something when the event is fired
    });
}]);
```


## API
### trigger(eventName, [parameters])
Fires an event

parameters can be any object or array of objects

```
//Fires myEvent
eventDispatcher.trigger('myEvent');

//Fires myEvent passing a parameter
eventDispatcher.trigger('myEvent', 'myParameter');
eventDispatcher.trigger('myEvent', {});

```

### on(eventName, callBack)
Subscribe to an event or to multiples events

callback: the function to be called when the event is fired

returns an object to unsubscribe the event

```
var callback = function(args) {
	console.log(args);
};

//subscribe to myEvent
var event1 = eventDispatcher.on('myEvent', callback);

//subscribe to myEvent and myNewEvent
var event2 = eventDispatcher.on(['myEvent', 'myNewEvent'], callback);

//unsubscribe the events
event1();
event2();
```

### off(eventName, callback)

callback: the function that will be unsubscribed

Unsubscribe an event or multiples events
```
var callbackFunction = function(){ };

//unsubscribe myEvent that was previous subscribed with callbackFunction
eventDispatcher.off('myEvent', callbackFunction);

//unsubscribe myEvent and myNewEvent
eventDispatcher.off(['myEvent', 'myNewEvent'], callbackFunction);

```
