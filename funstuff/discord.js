/** @param {NS} ns **/
export async function main(ns) {
	function sendMessage() {
		let message = ns.args[0];
		const request = new XMLHttpRequest();
		const webhookurl = "enter your webhook url";

		request.open("POST", webhookurl);
		request.setRequestHeader('Content-type', 'application/json');
		const params = {
			username: "bitburner",
			avatar_url: "",
			content: message
		}
		request.send(JSON.stringify(params));
	}

	sendMessage();
}