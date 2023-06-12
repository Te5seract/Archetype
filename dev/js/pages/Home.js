export default class Home {
    config_ () {
        return {
			route : [ "/", "index.html" ],
			//route : [ "/profile/{name}", "/profile/{name}/{id}" ],
			use : [
				"globals/Helper",
				"constants/observer"
			],

			//require : [
				//"constants/nav",
			//],
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
	}
}
