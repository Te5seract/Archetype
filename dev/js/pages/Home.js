export default class Home {
    config_ () {
        return {
            route : [ "/" ],
			require : {
				constants : [ "nav" ]
			}
        };
    }

	$home () {
		const query = this.route_();

		console.log(this);
	}
}
