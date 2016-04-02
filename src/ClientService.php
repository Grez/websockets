<?php

namespace Teddy\WebSockets;

use WebSocket\Client;



class ClientService
{

	/**
	 * Client
	 */
	private $client;

	/**
	 * @var string
	 */
	private $host;

	/**
	 * @var int
	 */
	private $port;



	public function __construct($host = 'ws://localhost', $port = 8080)
	{
		$this->host = $host;
		$this->port = $port;
	}


	/**
	 * @return Client
	 */
	public function getClient()
	{
		if (!$this->client) {
			$this->client = new Client($this->host . ':' . $this->port);
		}

		return $this->client;
	}



	/**
	 * Notifies selected users
	 *
	 * @param int[] $userIds
	 * @param string $component
	 * @param mixed $data
	 * @throws \WebSocket\BadOpcodeException
	 */
	public function notifyUsers(array $userIds, $component, $data)
	{
		$msg = new \stdClass();
		$msg->users = $userIds;
		$msg->method = Controller::METHOD_NOTIFY_USERS;

		$content = new \stdClass();
		$content->component = $component;
		$content->data = $data;

		$msg->data = json_encode($content);
		$this->getClient()->send(json_encode($msg));
	}



	/**
	 * Sends message to all connected users
	 *
	 * @param string $component
	 * @param mixed $data
	 * @throws \WebSocket\BadOpcodeException
	 */
	public function broadcast($component, $data)
	{
		$msg = new \stdClass();
		$msg->method = Controller::METHOD_BROADCAST;

		$content = new \stdClass();
		$content->component = $component;
		$content->data = $data;

		$msg->data = json_encode($content);
		$this->getClient()->send(json_encode($msg));
	}

}
