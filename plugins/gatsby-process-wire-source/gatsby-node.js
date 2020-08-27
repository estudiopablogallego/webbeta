const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const axios = require('axios')

const API_URI = `http://api.estudiopablogallego.com/apibeta/`
console.log("Getting data from...");
console.log(API_URI);
let smDebugTime = new Date()
function cl() {
	const timeDiferrence = new Date() - smDebugTime;
	smDebugTime = new Date();
	if(timeDiferrence>2000){
		console.log("----------------------------------")
	}
	console.log(timeDiferrence + 'ms');
	if(arguments.length==1){
		console.log(arguments[0]);
	} else {
		console.log(arguments);
	}
}
	
exports.sourceNodes = async ({ actions, store, cache, createNodeId, createContentDigest }) => {
	const { createNode, createNodeField } = actions
	// Fetch data
	const { data } = await axios.get(API_URI)
	//cl(data);
	const mainNode = await createNode({
		...data,
		id: `processwire`,
		parent: null,
		children: [],
		internal: {
			type: `processwire`,
			contentDigest: createContentDigest(data),
			// mediaType: `text`, // optional
			// content: JSON.stringify(fieldData), // optional
			description: `Main content`, // optional
		}
	});

	//Crea página como node raiz para poder filtrar
	data.pages.forEach(page => {
		cl(page.title)
		createNode({
			...page,
			id: createNodeId(page.pwid+page.lang), // required by Gatsby
			internal: {
				type: 'PWPages', // required by Gatsby
				contentDigest: createContentDigest('pwpages') // required by Gatsby, must be unique
			}
		});
		cl(page)

	});
}