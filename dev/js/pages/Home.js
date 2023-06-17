export default class Home {
    config_ () {
		const { admin_slug } = this.env("config");

        return {
			//route : [ `${ admin_slug }/settings` ],
			//route : [ "/profile/{name}", "/profile/{name}/{id}" ],
			route : [ "/", "index.html" ],
			use : [
				"globals/Helper",
				"constants/observer"
			],

			require : [
				"constants/nav",
			],
			//merge : [
				////"components/banner"
				//{ 
					//"constants/observer" : { 
						////ignore : [ "$start" ],
						//overwrite : false
					//}
				//}
			//]
        };
    }

	$home () {
		this.helper = new this.Helper();

		//console.log(this.source_());
	}
}
