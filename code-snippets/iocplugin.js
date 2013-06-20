require({
    config: {
        "amd-plugins/ioc": {
            "beans": {
                "logging/Logger": {
                    "type": "smithy/Logger",
                    "params": {
                        "logLevel": "debug"
                    }
                },
                "xhrDataProvider": {
                    "type": "circuits/NativeXhrDataProvider"
                },
                "serviceFactory": {
                    "type": "circuits/ServiceFactory",
                    "params": {
                        "provider": "ref:amd-plugins/ioc!xhrDataProvider"
                    }
                }
            }
        }
    }
});
