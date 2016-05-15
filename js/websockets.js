(function () {

	$.nette.ext('websockets', {

		init: function () {
			var self = this;
			self.userId = Cookies.get('teddy.userId');
			self.apiKey = Cookies.get('teddy.apiKey');
			self.makeConnection();
		}

	}, {

		conn: false,
		attempt: 0,
		userId: '',
		apiKey: '',
		intervals: [1, 2, 5, 30, 120, 300], // how often should we try to reconnect

		makeConnection: function () {
			var self = this;
			self.conn = new WebSocket(self.getServerUrl());
			self.attempt++;

			self.conn.onopen = function(e) {
				self.attempt = 0; // successful connection, let's set attempts back to 0
				self.authorize(self.userId, self.apiKey);
				console.log("Connection established!");
			};

			self.conn.onerror = function(e) {
				console.log('Connection errored');
				console.log(e);
			};

			self.conn.onclose = function(e) {
				console.log('Connection terminated. Attempt: #' + self.attempt);
				console.log(e);

				if (self.attempt >= self.intervals.length) {
					console.log('We\'ve tried to reconnect too many times');
					return;
				}

				console.log('Waiting for ' + self.intervals[self.attempt] + ' s and going to try again');
				setTimeout(function () {
					self.makeConnection();
				}, self.intervals[self.attempt] * 1000);
			};

			/**
			 * Example method, used in Teddy/Skeleton
			 */
			self.conn.onmessage = function(e) {
				var msg = JSON.parse(e.data);
				if (msg.component === 'pm') {
					events.updateUnreadMessages(msg.data);
				}
			};
		},

		// we need to pass the request on subdomain, check README.md
		getServerUrl: function () {
			var protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
			var host = window.location.hostname;
			host = host.substring(0, 4) === 'www.' ? host.substring(4) : host;
			return protocol + '://ws.' + host;
		},

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
		},

	});

})();
