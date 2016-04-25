# Teddy\WebSockets
Extension, helps with using WebSockets 

## Usage

``composer require teddy/websockets``

Copy websockets.js file, override the `Controller`, add `/bin/server.php`
Run `/bin/server.php`

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

It is neccessary to create subdomain `wss.domain.tld`, becase SSL won't work otherwise.
http://grezcz.tumblr.com/post/143320629816/rozchozen%C3%AD-ratchetu-na-ssl (check whether it won't break HTTP o_O)
