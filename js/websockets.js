(function () {

	$.nette.ext('websockets', {

		init: function () {
			var self = this;
			var userId = Cookies.get('teddy.userId');
			var apiKey = Cookies.get('teddy.apiKey');

			self.conn = new WebSocket('ws://localhost:8080');

			self.conn.onopen = function(e) {
				console.log("Connection established!");
				self.authorize(userId, apiKey);
			};

			self.conn.onerror = function(e) {
				console.log('Connection errored');
				console.log(e);
			};

			self.conn.onclose = function(e) {
				console.log("Terminated");
			};

			self.conn.onmessage = function(e) {
				var msg = JSON.parse(e.data);
				if (msg.component === 'pm') {
					events.updateUnreadMessages(msg.data);
				}
			};
		}

	}, {

		conn: false,
		msg: function (method, msg) {
			var req = {
				method: method,
				data: msg,
			};
			var json = JSON.stringify(req, null, 2);
			this.conn.send(json);
		},
		authorize: function (userId, apiKey) {
			var msg = { userId: userId, apiKey: apiKey };
			this.msg('authorize', msg);
		}

	});

})();
