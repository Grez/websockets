# Publisher
Extension, helps with using websockets 

## Usage

``composer require teddy/websockets``

Copy websockets.js file, override the `Controller`, add `/bin/server.php`

```php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require dirname(__DIR__) . '/vendor/autoload.php';

$rootDir = __DIR__ . '/..';

$params = [
	'wwwDir' => $rootDir . '/www',
	'appDir' => $rootDir . '/app',
	'tempDir' => $rootDir . '/temp',
	'testMode' => TRUE
];
$configurator = (new Nette\Configurator($params))
	->addConfig(__DIR__ . '/config.neon')
	->setDebugMode(TRUE);
$configurator->createRobotLoader()
	->addDirectory(__DIR__ . '/../app')
	->register();
$container = $configurator->createContainer();

$server = IoServer::factory(
	new HttpServer(
		new WsServer(
			new \Teddy\WebSockets\Controller($container) // you should override this class
		)
	),
	8080
);

$server->run();
```
