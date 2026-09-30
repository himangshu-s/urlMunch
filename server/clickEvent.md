src/
├── models/
│   └── clickEvent.model.js
│
├── services/
│   └── analytics.service.js
│
├── queues/
│   └── analytics.queue.js
│
└── workers/
    ├── analytics.worker.js
    └── worker.js

Their responsibilities are now very straightforward:

File	Purpose
clickEvent.model.js=	Stores individual click events
analytics.service.js	=Creates click events and sends them to queue
analytics.queue.js=	Redis main + dead-letter queues
analytics.worker.js	=Processes events and retries up to 3 times
worker.js=	Starts the worker process