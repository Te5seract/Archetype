export default class Documentation {
	config_ () {
		return {
			name : "docs",
			route : [ "/documentation.html" ],
			require : [
				{ 
					"constants/observer" : {
						methods : [ "methodOne" ]
					} 

				}
			]
		}
	}

	$doc () {
	}
}
