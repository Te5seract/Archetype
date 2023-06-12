export default class Observer {
	config_ () {
		return {
			name : "observer",
			merge : [
				//"components/banner"
				{ 
					"components/banner" : { 
						methods : [ "markup" ]
					}
				}
			]
		}
	}

	methodOne () {}

	$start () {
	}
}
