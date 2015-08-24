angular.module('myApp', ['eventDispatcherModule']);
```

3. Receive the eventDispatcher into your services
```
.service('myService', ['eventDispatcher', function(eventDispather) {

    eventDispatcher.trigger('myEvent', 'parameter');

}]);

.controller('myController', ['eventDispatcher', function(eventDispather) {
    eventDispatcher.on('myEvent', function(arg) {
        // do something when the event is fired
    });
}]);
```


## API
### trigger
Fires an event
```

```

### on
Subscribe to an event or multiples events
```

```

### off
Unsubscribe an event or multiples events
```

```

