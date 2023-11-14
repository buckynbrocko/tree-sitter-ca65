const Parser = require('web-tree-sitter');


const getParser = () => {
    return Parser.init().then(() => {
        return Parser.Language.load("tree-sitter-ca65.wasm").then(ca65 => {
            let parser = new Parser();
            parser.setLanguage(ca65);
            return parser;
        })
    });
}

function walkTree(node, indent = 0) {
    let indentation = "    ".repeat(indent);
    let isTerminal = node.children.length === 0
    if (node.isNamed()) {
        // let string = indentation + "(" + node.type
        let string = indentation + node.type
        // if (isTerminal) {
        //     string += ")";
        // }
        console.log(string);
    }
    node.children.forEach((child) => {
        walkTree(child, indent + 1);
    });
    // if (!isTerminal) {
    //     console.log(indentation + ")");
    // }
}

(async () => {
    const parser = await getParser();
    return parser;
})().then((parser) => {
    let parse = (text) => parser.parse(text);
    let tree;
    tree = parse("adc 65, x\nadc (65), y");
    walkTree(tree.rootNode);
    debugger;
    console.log(parser);
});
